import { Prisma, Coin } from "@prisma/client";

import db from "../db";
import { CoinHistoricalDataResponse, FullCoinResponse } from "./coin.schema";
import { getHistoricalData, getOHLC, getPrice } from "../apis/coingecko_api";

function calculateChange(open: number, current: number) {
  return new Prisma.Decimal(current).sub(open).toDecimalPlaces(2).toString();
}

function calculateChangePercent(open: number, current: number) {
  return new Prisma.Decimal(current)
    .sub(open)
    .div(open)
    .mul(100)
    .toDecimalPlaces(2)
    .toString();
}

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

export async function getCoin(id: number): Promise<FullCoinResponse> {
  const coin = await db.coin.findUniqueOrThrow({ where: { id } });

  const ohlc = await getOHLC(coin.externalId);
  const currentPrice = await getPrice(coin.externalId);

  return {
    ...coin,
    currentPrice,
    openPrice: ohlc.open.toString(),
    dayHigh: ohlc.dayHigh.toString(),
    dayLow: ohlc.dayLow.toString(),
    previousClose: ohlc.previousClose.toString(),
    change: calculateChange(ohlc.open, +currentPrice),
    changePercent: calculateChangePercent(ohlc.open, +currentPrice),
  };
}

export async function getCoinHistoricalData(
  coinId: number,
): Promise<CoinHistoricalDataResponse> {
  const coin = await db.coin.findUniqueOrThrow({ where: { id: coinId } });

  const response = await getHistoricalData(coin.externalId, 1);
  return {
    prices: response.prices,
    marketCaps: response.market_caps,
    totalVolumes: response.total_volumes,
  };
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
