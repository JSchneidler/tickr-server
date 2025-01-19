import { SymbolType } from "@prisma/client";
import { Type, type Static } from "@sinclair/typebox";

// API
export const symbolId = Type.Number();

export const getSymbolParams = Type.Object({
  symbolId,
});
export type GetSymbolParams = Static<typeof getSymbolParams>;

export const searchSymbolsParams = Type.Object({
  text: Type.String(),
});
export type SearchSymbolsParams = Static<typeof searchSymbolsParams>;

export const symbolResponse = Type.Object({
  id: symbolId,
  name: Type.String(),
  displayName: Type.String(),
  description: Type.Union([Type.String(), Type.Null()]),
  type: Type.Enum(SymbolType),
  mic: Type.Union([Type.String(), Type.Null()]),
  figi: Type.Union([Type.String(), Type.Null()]),
  createdAt: Type.String(),
  updatedAt: Type.String(),
  deletedAt: Type.Union([Type.String(), Type.Null()]),
});
export const symbolsResponse = Type.Array(symbolResponse);

const companyInfoResponse = Type.Object({
  companyName: Type.Union([Type.String(), Type.Null()]),
  companyDescription: Type.Union([Type.String(), Type.Null()]),
  homepageUrl: Type.Union([Type.String(), Type.Null()]),
  marketCap: Type.Union([Type.Number(), Type.Null()]),
  sic_code: Type.Union([Type.String(), Type.Null()]),
  sic_description: Type.Union([Type.String(), Type.Null()]),
  total_employees: Type.Union([Type.Number(), Type.Null()]),
});

export const fullSymbolResponse = Type.Object({
  ...symbolResponse.properties,
  ...companyInfoResponse.properties,
});
export type FullSymbolResponse = Static<typeof fullSymbolResponse>;
