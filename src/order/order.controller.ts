import { FastifyReply, FastifyRequest } from "fastify";

import {
  getOrders,
  getOrder,
  updateOrder,
  deleteOrder,
  createOrder,
} from "./order.service";
import {
  CreateOrderInput,
  GetOrderInput,
  UpdateOrderInput,
} from "./order.schema";

import db from "../db";
import { OrderDirection } from "@prisma/client";

export async function createOrderHandler(
  req: FastifyRequest<{ Body: CreateOrderInput }>,
  rep: FastifyReply,
) {
  const order = req.body;

  if (req.body.direction === "SELL") {
    const sharesBeingSoldAgg = await db.order.aggregate({
      _sum: {
        shares: true,
      },
      where: {
        userId: req.user.id,
        filled: false,
        symbol: order.symbol,
        direction: OrderDirection.SELL,
      },
    });

    const holding = await db.holding.findUniqueOrThrow({
      where: { userId_symbol: { symbol: order.symbol, userId: req.user.id } },
    });

    if (
      holding.shares.lessThan(
        sharesBeingSoldAgg._sum.shares
          ? sharesBeingSoldAgg._sum.shares.add(order.shares)
          : order.shares,
      )
    )
      return rep.code(400).send("Insufficient shares in holding");
  }

  return await createOrder(order, req.user);
}

export async function getOrdersHandler() {
  return await getOrders();
}

export async function getOrderHandler(
  req: FastifyRequest<{ Params: GetOrderInput }>,
) {
  return await getOrder(req.params.order_id);
}

export async function updateOrderHandler(
  req: FastifyRequest<{ Params: GetOrderInput; Body: UpdateOrderInput }>,
) {
  return await updateOrder(req.params.order_id, req.body);
}

export async function deleteOrderHandler(
  req: FastifyRequest<{ Params: GetOrderInput }>,
) {
  const id = req.params.order_id;
  await deleteOrder(id);
  return id;
}
