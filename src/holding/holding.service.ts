import { Prisma } from "../generated/prisma/client";

import db from "../db";
import { UserWithoutSensitive } from "../user/user.schema";

export async function createHolding(
  holdingInput: Prisma.HoldingCreateInput,
  user: UserWithoutSensitive,
  coinId: number,
) {
  return await db.holding.create({
    data: {
      ...holdingInput,
      User: { connect: { id: user.id } },
      Coin: { connect: { id: coinId } },
    },
  });
}

export async function getHoldings() {
  return await db.holding.findMany();
}

export async function getHoldingsForUser(userId: number) {
  return await db.holding.findMany({ where: { userId } });
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
