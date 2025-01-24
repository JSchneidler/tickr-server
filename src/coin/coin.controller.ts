import { FastifyRequest } from "fastify";

import { getCoin, getCoinHistoricalData, getCoins } from "./coin.service";
import { GetCoinParams } from "./coin.schema";

export async function getCoinsHandler() {
  return await getCoins();
}

export async function getCoinHandler(
  req: FastifyRequest<{ Params: GetCoinParams }>,
) {
  return await getCoin(req.params.coinId);
}

export async function getCoinHistoricalDataHandler(
  req: FastifyRequest<{ Params: GetCoinParams }>,
) {
  return await getCoinHistoricalData(req.params.coinId);
}
