import { Type, type Static } from "@sinclair/typebox";

const symbolCore = {
  name: Type.String(),
  displayName: Type.String(),
  description: Type.String(),
  mic: Type.String(),
  figi: Type.String(),
};

export const symbolResponseSchema = Type.Object({
  ...symbolCore,
  id: Type.Number(),
  createdAt: Type.String(),
  updatedAt: Type.String(),
  deletedAt: Type.Union([Type.String(), Type.Null()]),
});
export type SymbolResponse = Static<typeof symbolResponseSchema>;

export const symbolsResponseSchema = Type.Array(symbolResponseSchema);
export type SymbolsResponse = Static<typeof symbolsResponseSchema>;

export const createSymbolSchema = Type.Object(symbolCore);
export type CreateSymbolInput = Static<typeof createSymbolSchema>;

export const getSymbolSchema = Type.Object({ symbol_id: Type.Number() });
export type GetSymbolInput = Static<typeof getSymbolSchema>;

export const updateSymbolSchema = Type.Object(
  Type.Omit(createSymbolSchema, ["name", "mic", "figi"]),
);
export type UpdateSymbolInput = Static<typeof updateSymbolSchema>;

export const searchSymbolsSchema = Type.Object({ text: Type.String() });
export type SearchSymbolInput = Static<typeof searchSymbolsSchema>;

export const searchSymbolsResponseSchema = Type.Array(
  Type.Object({
    symbol: symbolResponseSchema,
    quote: Type.Object(Type.Any()), // TODO: Replace Any with schema
  }),
);
