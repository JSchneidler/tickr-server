import { Prisma } from "@prisma/client";

import "../env";
import db from "../db";

const SYMBOLS = [
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
async function fetchSymbols() {
  let count = 0;

  for (const symbol of SYMBOLS) {
    count++;

    const updates: Prisma.SymbolUpdateInput = {
      displayName: symbol.displayName,
      description: symbol.description,
    };
    await db.symbol.upsert({
      where: { name: symbol.name },
      update: updates,
      create: {
        ...(updates as Prisma.SymbolCreateInput),
        name: symbol.name,
      },
    });
  }

  console.log(`Registered ${count.toString()} symbols`);
}

void fetchSymbols();
