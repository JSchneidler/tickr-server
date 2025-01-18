import { Type, type Static } from "@sinclair/typebox";
import { SymbolType } from "@prisma/client";

const symbolCore = {
  name: Type.String(),
  displayName: Type.String(),
  description: Type.String(),
  type: Type.Enum(SymbolType),
};

export const symbolResponseSchema = Type.Object({
  ...symbolCore,
  id: Type.Number(),
  mic: Type.Union([Type.String(), Type.Null()]),
  figi: Type.Union([Type.String(), Type.Null()]),
  createdAt: Type.String(),
  updatedAt: Type.String(),
  deletedAt: Type.Union([Type.String(), Type.Null()]),
});
export type SymbolResponse = Static<typeof symbolResponseSchema>;

export const fullSymbolResponseSchema = Type.Object({
  ...symbolResponseSchema.properties,

  // Company Info
  companyName: Type.Optional(Type.String()),
  companyDescription: Type.Optional(Type.String()),
  homepageUrl: Type.Optional(Type.String()),
  marketCap: Type.Optional(Type.Number()),
  sic_code: Type.Optional(Type.String()),
  sic_description: Type.Optional(Type.String()),
  total_employees: Type.Optional(Type.Number()),

  // Quote
});
export type FullSymbolResponse = Static<typeof fullSymbolResponseSchema>;

export const symbolsResponseSchema = Type.Array(symbolResponseSchema);
export type SymbolsResponse = Static<typeof symbolsResponseSchema>;

export const createSymbolSchema = Type.Object(symbolCore);
export type CreateSymbolInput = Static<typeof createSymbolSchema>;

export const getSymbolSchema = Type.Object({
  name: Type.String(),
  type: Type.Enum(SymbolType),
});
export type GetSymbolInput = Static<typeof getSymbolSchema>;

export const updateSymbolSchema = Type.Omit(createSymbolSchema, [
  "name",
  "mic",
  "figi",
]);
export type UpdateSymbolInput = Static<typeof updateSymbolSchema>;

export const searchSymbolsSchema = Type.Object({ text: Type.String() });
export type SearchSymbolInput = Static<typeof searchSymbolsSchema>;
