import { Prisma } from "@prisma/client";

import env from "../env";
import { SUPPORTED_COINS } from "./supported_coins";

interface CoinData {
  description: {
    en: string;
  };
}

const API_BASE_URL = "https://api.coingecko.com/api/v3";

// const EXCHANGE = "binance";

// TODO: Create client?
function baseRequest(url: string) {
  const request = new Request(API_BASE_URL + url);
  request.headers.append("x-cg-demo-api-key", env.COINGECKO_API_KEY);
  return request;
}

export async function getCoinData(): Promise<Prisma.CoinCreateInput[]> {
  const coins: Prisma.CoinCreateInput[] = [];
  for (const coin of SUPPORTED_COINS) {
    const request = baseRequest(`/coins/${coin.externalId}`);
    const response = await fetch(request);
    const coinData = (await response.json()) as CoinData;

    coins.push({
      ...coin,
      description: coinData.description.en,
    });
  }

  return coins;
}
