import { Prisma } from "@prisma/client";

export const SUPPORTED_COINS: Prisma.CoinCreateInput[] = [
  {
    externalId: "bitcoin",
    name: "BTC",
    displayName: "Bitcoin",
  },
  {
    externalId: "ethereum",
    name: "ETH",
    displayName: "Ethereum",
  },
  {
    externalId: "ripple",
    name: "XRP",
    displayName: "Ripple",
  },
  {
    externalId: "dogecoin",
    name: "DOGE",
    displayName: "Dogecoin",
  },
  {
    externalId: "binancecoin",
    name: "BNB",
    displayName: "Binancecoin",
  },
  {
    externalId: "solana",
    name: "SOL",
    displayName: "Solana",
  },
  {
    externalId: "tron",
    name: "TRX",
    displayName: "Tron",
  },
];
