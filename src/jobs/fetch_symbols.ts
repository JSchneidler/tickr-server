import { getStockSymbols } from "../stocks/finnhub_api";
import db from "../db";

import "../env";
import { Prisma, SymbolType } from "@prisma/client";

async function fetchStockSymbols() {
  const symbols = await getStockSymbols();

  let count = 0;
  for (const symbol of symbols) {
    count++;
    // console.log(`Processing ${symbol.symbol}: ${symbol.displaySymbol}`);

    if (!symbol.figi) continue;

    const updates = {
      displayName: symbol.displaySymbol,
      description: symbol.description,
      type: SymbolType.STOCK,
    };

    await db.symbol.upsert({
      where: { figi: symbol.figi },
      update: updates,
      create: {
        ...updates,
        name: symbol.symbol,
        mic: symbol.mic,
        figi: symbol.figi,
      },
    });
  }

  console.log(`Registered ${count.toString()} stock symbols`);
}

const CRYPTO_SYMBOLS = [
  {
    displayName: "BTC",
    name: "BINANCE:BTCUSDT",
    description: "It's Bitcoin, idfk.",
  },
  {
    displayName: "ETH",
    name: "BINANCE:ETHUSDT",
    description: "It's Ethereum, idfk.",
  },
  {
    displayName: "BNB",
    name: "BINANCE:BNBUSDT",
    description: "It's Binance Coin, idfk.",
  },
  {
    displayName: "XRP",
    name: "BINANCE:XRPUSDT",
    description: "It's Ripple, idfk.",
  },
  {
    displayName: "ADA",
    name: "BINANCE:ADAUSDT",
    description: "It's Cardano, idfk.",
  },
];
async function fetchCryptoSymbols() {
  let count = 0;

  for (const symbol of CRYPTO_SYMBOLS) {
    count++;

    const updates: Prisma.SymbolUpdateInput = {
      displayName: symbol.displayName,
      description: symbol.description,
      type: SymbolType.CRYPTO,
    };
    await db.symbol.upsert({
      where: { name_type: { name: symbol.name, type: SymbolType.CRYPTO } },
      update: updates,
      create: {
        ...(updates as Prisma.SymbolCreateInput),
        name: symbol.name,
      },
    });
  }

  console.log(`Registered ${count.toString()} crypto symbols`);
}

async function fetchSymbols() {
  await Promise.all([fetchStockSymbols(), fetchCryptoSymbols()]);
}

void fetchSymbols();
