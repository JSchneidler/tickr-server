import { Prisma, Symbol, SymbolType } from "@prisma/client";

import db from "../db";
import { getCompanyInfo } from "../stocks/polygon_api";
import { FullSymbolResponse } from "./symbol.schema";
import { getQuote } from "../stocks/finnhub_api";

export async function createSymbol(
  symbolInput: Prisma.SymbolCreateInput,
): Promise<Symbol> {
  return await db.symbol.create({
    data: symbolInput,
  });
}

export async function getSymbols(): Promise<Symbol[]> {
  return await db.symbol.findMany({ take: 100 });
}

export async function getSymbol(
  id: number,
): Promise<Symbol | FullSymbolResponse> {
  const symbol = await db.symbol.findUniqueOrThrow({ where: { id } });

  if (symbol.type === SymbolType.STOCK) {
    // TODO: Cache info in DB
    const [quote, companyInfo] = await Promise.all([
      getQuote(symbol.name),
      getCompanyInfo(symbol.name),
    ]);

    return {
      ...symbol,
      // TODO: Better way to do this?
      companyName: companyInfo.name || null,
      companyDescription: companyInfo.description || null,
      homepageUrl: companyInfo.homepage_url || null,
      marketCap: companyInfo.market_cap || null,
      sic_code: companyInfo.sic_code || null,
      sic_description: companyInfo.sic_description || null,
      total_employees: companyInfo.total_employees || null,

      currentPrice: quote.c.toString(),
      openPrice: quote.o.toString(),
      change: quote.d.toString(),
      changePercent: quote.dp.toString(),
      dayHigh: quote.h.toString(),
      dayLow: quote.l.toString(),
      previousClose: quote.pc.toString(),
    };
  }

  return symbol;
}

export async function updateSymbol(
  id: number,
  symbolUpdates: Prisma.SymbolUpdateInput,
): Promise<Symbol> {
  return await db.symbol.update({ where: { id }, data: symbolUpdates });
}

export async function deleteSymbol(id: number): Promise<void> {
  await db.symbol.delete({ where: { id } });
}

export async function searchSymbols(text: string): Promise<Symbol[]> {
  let where: Prisma.SymbolWhereInput = {
    OR: [
      { displayName: { contains: text.toUpperCase() } },
      { description: { contains: text.toUpperCase() } },
    ],
  };
  if (text.startsWith("@"))
    where = {
      displayName: text.substring(1).toUpperCase(),
    };
  return await db.symbol.findMany({
    where,
    take: 25,
  });
}

export default {
  createSymbol,
  getSymbols,
  getSymbol,
  updateSymbol,
  deleteSymbol,
};
