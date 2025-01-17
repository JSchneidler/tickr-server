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

export async function getSymbol(id: number) {
  return await db.symbol.findUniqueOrThrow({ where: { id } });
}

export async function updateSymbol(id: number, data: UpdateSymbolInput) {
  return await db.symbol.update({ where: { id }, data });
}

export async function deleteSymbol(id: number) {
  return await db.symbol.delete({ where: { id } });
}

export async function searchSymbols(text: string) {
  return await db.symbol.findMany({
    where: {
      OR: [
        { displayName: { contains: text.toUpperCase() } },
        { description: { contains: text.toUpperCase() } },
      ],
    },
    take: 10,
  });
}

export default {
  createSymbol,
  getSymbols,
  getSymbol,
  updateSymbol,
  deleteSymbol,
};
