import { Prisma, Symbol } from "@prisma/client";

import db from "../db";
import { FullSymbolResponse } from "./symbol.schema";

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
  return await db.symbol.findUniqueOrThrow({ where: { id } });
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
