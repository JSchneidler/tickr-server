import { FastifyRequest } from "fastify";

import { getSymbol, getSymbols, searchSymbols } from "./symbol.service";
import { GetSymbolParams, SearchSymbolsParams } from "./symbol.schema";

export async function getSymbolsHandler() {
  return await getSymbols();
}

export async function getSymbolHandler(
  req: FastifyRequest<{ Params: GetSymbolParams }>,
) {
  return await getSymbol(req.params.symbolId);
}

export async function searchSymbolsHandler(
  req: FastifyRequest<{ Params: SearchSymbolsParams }>,
) {
  return await searchSymbols(req.params.text);
}
