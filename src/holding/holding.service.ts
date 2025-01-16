import db from "../db";
import { UserWithoutSensitive } from "../user/user.schema";
import { CreateHoldingInput, UpdateHoldingInput } from "./holding.schema";

export async function createHolding(
  data: CreateHoldingInput,
  user: UserWithoutSensitive,
) {
  return await db.holding.create({
    data: { ...data, userId: user.id },
  });
}

export async function getHoldings() {
  return await db.holding.findMany();
}

export async function getHolding(id: number) {
  return await db.holding.findUniqueOrThrow({ where: { id } });
}

export async function updateHolding(id: number, data: UpdateHoldingInput) {
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
