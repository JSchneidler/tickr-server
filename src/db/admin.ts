import { Prisma } from "@prisma/client";

import db from "./db";

export async function banUser(data: Prisma.OrderCreateInput) {
  return await db.order.create({ data });
}

export async function getHoldingsForUser(id: number) {
  return await db.order.findFirstOrThrow({ where: { id } });
}

export default {
  banUser,
  getHoldingsForUser,
};
