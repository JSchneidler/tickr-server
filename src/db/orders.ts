import { Prisma } from "@prisma/client";

import db from "./db";

export async function createOrder(data: Prisma.OrderCreateInput) {
  return await db.order.create({ data });
}

export async function getOrders() {
  return await db.order.findMany();
}

export async function getOrder(id: number) {
  return await db.order.findFirstOrThrow({ where: { id } });
}

export async function updateOrder(id: number, data: Prisma.OrderUpdateInput) {
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
