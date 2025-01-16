import { Static, Type } from "@sinclair/typebox";

const holdingCore = {
  symbol: Type.String(),
  shares: Type.Number(),
};

export const holdingResponseSchema = Type.Object({
  ...holdingCore,
  id: Type.Number(),
  createdAt: Type.String(),
  updatedAt: Type.String(),
  deletedAt: Type.Optional(Type.String()),
});
export type HoldingResponse = Static<typeof holdingResponseSchema>;

export const holdingsResponseSchema = Type.Array(holdingResponseSchema);
export type HoldingsResponse = Static<typeof holdingsResponseSchema>;

export const createHoldingSchema = Type.Object(holdingCore);
export type CreateHoldingInput = Static<typeof createHoldingSchema>;

export const getHoldingSchema = Type.Object({ holding_id: Type.Number() });
export type GetHoldingInput = Static<typeof getHoldingSchema>;

export const updateHoldingSchema = Type.Object(
  Type.Omit(createHoldingSchema, ["symbol"]),
);
export type UpdateHoldingInput = Static<typeof updateHoldingSchema>;
