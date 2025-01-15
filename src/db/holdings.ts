import { Prisma } from "@prisma/client";

import db from ".";

export async function createHolding(data: Prisma.HoldingCreateInput) {
  return await db.holding.create({ data });
}

export async function getHoldings() {
  return await db.holding.findMany();
}

export async function getHolding(id: number) {
  return await db.holding.findFirstOrThrow({ where: { id } });
}

export async function updateHolding(
  id: number,
  data: Prisma.HoldingUpdateInput,
) {
  return await db.holding.update({ where: { id }, data });
}

export async function deleteHolding(id: number) {
  return await db.holding.delete({ where: { id } });
}

export default {
  createHolding,
  getHoldings,
  getHolding,
  updateHolding,
  deleteHolding,
};
