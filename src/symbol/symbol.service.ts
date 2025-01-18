import { SymbolType } from "@prisma/client";
import db from "../db";
import { CreateSymbolInput, UpdateSymbolInput } from "./symbol.schema";

export async function createSymbol(data: CreateSymbolInput) {
  return await db.symbol.create({
    data,
  });
}

export async function getSymbols() {
  return await db.symbol.findMany({ take: 100 });
}

export async function getSymbol(name: string, type: SymbolType) {
  return await db.symbol.findUniqueOrThrow({
    where: { name_type: { name, type } },
  });
}

export async function updateSymbol(id: number, data: UpdateSymbolInput) {
  return await db.symbol.update({ where: { id }, data });
}

export async function deleteSymbol(id: number) {
  return await db.symbol.delete({ where: { id } });
}

export async function searchSymbols(text: string) {
  let where = {
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
