import { Prisma, Coin } from "@prisma/client";

import db from "../db";
import { FullCoinResponse } from "./coin.schema";

export async function createCoin(
  coinInput: Prisma.CoinCreateInput,
): Promise<Coin> {
  return await db.coin.create({
    data: coinInput,
  });
}

export async function getCoins(): Promise<Coin[]> {
  return await db.coin.findMany({ take: 100 });
}

export async function getCoin(id: number): Promise<Coin | FullCoinResponse> {
  return await db.coin.findUniqueOrThrow({ where: { id } });
}

export async function updateCoin(
  id: number,
  coinUpdates: Prisma.CoinUpdateInput,
): Promise<Coin> {
  return await db.coin.update({ where: { id }, data: coinUpdates });
}

export async function deleteCoin(id: number): Promise<void> {
  await db.coin.delete({ where: { id } });
}
