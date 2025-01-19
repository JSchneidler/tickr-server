import { SymbolType } from "@prisma/client";
import {
  Number,
  Object,
  String,
  Union,
  Null,
  Enum,
  Optional,
  Array,
  type Static,
} from "@sinclair/typebox";

// API
export const symbolId = Number();

export const getSymbolParams = Object({
  symbolId,
});
export type GetSymbolParams = Static<typeof getSymbolParams>;

export const searchSymbolsParams = Object({
  text: String(),
});
export type SearchSymbolsParams = Static<typeof searchSymbolsParams>;

export const symbolResponse = Object({
  id: symbolId,
  name: String(),
  displayName: String(),
  description: Union([String(), Null()]),
  type: Enum(SymbolType),
  mic: Union([String(), Null()]),
  figi: Union([String(), Null()]),
  createdAt: String(),
  updatedAt: String(),
  deletedAt: Optional(String()),
});
export const symbolsResponse = Array(symbolResponse);

const companyInfoResponse = Object({
  companyName: Union([String(), Null()]),
  companyDescription: Union([String(), Null()]),
  homepageUrl: Union([String(), Null()]),
  marketCap: Union([Number(), Null()]),
  sic_code: Union([String(), Null()]),
  sic_description: Union([String(), Null()]),
  total_employees: Union([Number(), Null()]),
});

const priceInfoResponse = Object({
  currentPrice: Union([String(), Null()]),
  openPrice: Union([String(), Null()]),
  change: Union([String(), Null()]),
  changePercent: Union([String(), Null()]),
  dayHigh: Union([String(), Null()]),
  dayLow: Union([String(), Null()]),
  previousClose: Union([String(), Null()]),
});

export const fullSymbolResponse = Object({
  ...symbolResponse.properties,
  ...companyInfoResponse.properties,
  ...priceInfoResponse.properties,
});
export type FullSymbolResponse = Static<typeof fullSymbolResponse>;
