import db from "../db";
import tradeEngine from "../tradeEngine";
import { UserWithoutSensitive } from "../user/user.schema";
import { CreateOrderInput, UpdateOrderInput } from "./order.schema";

export async function createOrder(
  data: CreateOrderInput,
  user: UserWithoutSensitive,
) {
  if (!(await db.symbol.findFirst({ where: { name: data.symbol } })))
    throw Error("Symbol not found in DB");

  const order = await db.order.create({ data: { ...data, userId: user.id } });

  // @ts-expect-error: Decimal is assignable to number
  tradeEngine.addOrder(order);

  return order;
}

export async function getOrders() {
  return await db.order.findMany();
}

export async function getOrder(id: number) {
  return await db.order.findUniqueOrThrow({ where: { id } });
}

export async function updateOrder(id: number, data: UpdateOrderInput) {
  return await db.order.update({ where: { id }, data });
}

export async function deleteOrder(id: number) {
  await db.order.delete({ where: { id } });
  return id;
}

export default {
  createOrder,
  getOrders,
  getOrder,
  updateOrder,
  deleteOrder,
};
