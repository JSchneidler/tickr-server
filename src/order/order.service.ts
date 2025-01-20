import { OrderDirection, Prisma } from "@prisma/client";

import db from "../db";
import tradeEngine from "../tradeEngine";
import { OrderCreateInput } from "./order.schema";
import { getSymbol } from "../symbol/symbol.service";

export async function createOrder(
  orderInput: OrderCreateInput,
  userId: number,
  symbolId: number,
) {
  const symbol = await getSymbol(symbolId);

  if (orderInput.direction === OrderDirection.SELL) {
    const sharesBeingSoldAgg = await db.order.aggregate({
      _sum: {
        shares: true,
      },
      where: {
        userId,
        symbolId: symbol.id,
        filled: false,
        direction: OrderDirection.SELL,
      },
    });

    const holding = await db.holding.findUniqueOrThrow({
      where: { userId_symbolId: { userId, symbolId: symbol.id } },
    });

    if (
      holding.shares.lessThan(
        sharesBeingSoldAgg._sum.shares
          ? sharesBeingSoldAgg._sum.shares.add(orderInput.shares)
          : new Prisma.Decimal(orderInput.shares),
      )
    )
      throw Error("Insufficient shares in holding");
  }

  // return await createOrder(order, req.user);
  const order = await db.order.create({
    data: {
      ...orderInput,
      User: { connect: { id: userId } },
      Symbol: { connect: { id: symbol.id } },
    },
  });

  tradeEngine.addOrder(order, symbol);

  return order;
}

export async function getOrders() {
  return await db.order.findMany();
}

export async function getOrdersForUser(userId: number) {
  return await db.order.findMany({ where: { userId } });
}

export async function getOrder(id: number) {
  return await db.order.findUniqueOrThrow({ where: { id } });
}

export async function updateOrder(id: number, data: Prisma.OrderUpdateInput) {
  return await db.order.update({ where: { id }, data });
}

export async function deleteOrder(id: number) {
  const order = await db.order.delete({ where: { id } });

  const symbol = await getSymbol(order.symbolId);
  tradeEngine.removeOrder(order, symbol);

  return id;
}

export default {
  createOrder,
  getOrders,
  getOrder,
  updateOrder,
  deleteOrder,
};
