import { Prisma } from "@prisma/client";

import db from "../db";
import { UserWithoutSensitive } from "../user/user.schema";

export async function createHolding(
  holdingInput: Prisma.HoldingCreateInput,
  user: UserWithoutSensitive,
  symbolId: number,
) {
  return await db.holding.create({
    data: {
      ...holdingInput,
      User: { connect: { id: user.id } },
      Symbol: { connect: { id: symbolId } },
    },
  });
}

export async function getHoldings() {
  return await db.holding.findMany();
}

export async function getHolding(id: number) {
  return await db.holding.findUniqueOrThrow({ where: { id } });
}

export async function updateHolding(
  id: number,
  holdingUpdates: Prisma.HoldingUpdateInput,
) {
  return await db.holding.update({ where: { id }, data: holdingUpdates });
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
