import { FastifyRequest } from "fastify";

import { getSymbol, getSymbols, searchSymbols } from "./symbol.service";
import {
  FullSymbolResponse,
  GetSymbolInput,
  SearchSymbolInput,
} from "./symbol.schema";
import { getCompanyInfo } from "../stocks/polygon_api";
import { SymbolType } from "@prisma/client";

export async function getSymbolsHandler() {
  return await getSymbols();
}

export async function getSymbolHandler(
  req: FastifyRequest<{ Params: GetSymbolInput }>,
): Promise<FullSymbolResponse> {
  // TODO: Add return types to other controllers

  if (req.params.type === SymbolType.STOCK) {
    const [symbol, companyInfo] = await Promise.all([
      getSymbol(req.params.name, SymbolType.STOCK),
      getCompanyInfo(req.params.name),
    ]);

    // TODO: Cache info in DB
    // @ts-expect-error: Date is assignable to string
    return {
      ...symbol,
      companyName: companyInfo.name,
      companyDescription: companyInfo.description,
      homepageUrl: companyInfo.homepage_url,
      marketCap: companyInfo.market_cap,
      sic_code: companyInfo.sic_code,
      sic_description: companyInfo.sic_description,
      total_employees: companyInfo.total_employees,
    };
  } else
    // @ts-expect-error: Date is assignable to string
    return await getSymbol(req.params.name, SymbolType.CRYPTO);
}

export async function searchSymbolsHandler(
  req: FastifyRequest<{ Params: SearchSymbolInput }>,
) {
  return await searchSymbols(req.params.text);
}
