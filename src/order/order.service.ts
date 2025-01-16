import db from "../db";
import { UserWithoutSensitive } from "../user/user.schema";
import { CreateOrderInput, UpdateOrderInput } from "./order.schema";

export async function createOrder(
  data: CreateOrderInput,
  user: UserWithoutSensitive,
) {
  return await db.order.create({ data: { ...data, userId: user.id } });
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
