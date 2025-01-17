import { FastifyRequest } from "fastify";

import { getSymbol, getSymbols, searchSymbols } from "./symbol.service";
import {
  GetSymbolInput,
  SearchSymbolInput,
  SymbolResponse,
} from "./symbol.schema";
import { getQuote } from "../stocks/finnhub_api";

interface Quote {
  price: number;
  open_price: number;
  change: number;
  change_percent: number;
}

interface Result {
  symbol: SymbolResponse;
  quote: Quote;
}

type SearchResults = Record<string, Result>;

export async function getSymbolsHandler() {
  return await getSymbols();
}

export async function getSymbolHandler(
  req: FastifyRequest<{ Params: GetSymbolInput }>,
) {
  return await getSymbol(req.params.symbol_id);
}

export async function searchSymbolsHandler(
  req: FastifyRequest<{ Params: SearchSymbolInput }>,
) {
  const symbols = await searchSymbols(req.params.text);
  const searchResults: SearchResults = {};
  for (const symbol of symbols) {
    const quote = await getQuote(symbol.name);

    searchResults[symbol.name] = {
      // @ts-expect-error: Date is assignable to string
      symbol,
      quote: {
        price: quote.c,
        open_price: quote.o,
        change: quote.d,
        change_percent: quote.dp,
      },
    };
  }

  return searchResults;
}
