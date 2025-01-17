import { getSymbols } from "../stocks/finnhub_api";
import db from "../db";

import "../env";

export default async function fetchSymbols() {
  const symbols = await getSymbols();

  let count = 0;
  for (const symbol of symbols) {
    count++;

    console.log(`Processing ${symbol.symbol}: ${symbol.displaySymbol}`);

    const updates = {
      displayName: symbol.displaySymbol,
      description: symbol.description,
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

  console.log(`Registered ${count.toString()} symbols`);
}

void fetchSymbols();
