import { Type, type Static } from "@sinclair/typebox";
import { userId } from "../user/user.schema";
import { symbolId } from "../symbol/symbol.schema";

// API
export const holdingId = Type.Number();

export const getHoldingParams = Type.Object({
  holdingId,
});
export type GetHoldingParams = Static<typeof getHoldingParams>;

export const holdingResponse = Type.Object({
  id: holdingId,
  userId,
  symbolId,
  createdAt: Type.String(),
  updatedAt: Type.String(),
  deletedAt: Type.Union([Type.String(), Type.Null()]),
});
export const holdingsResponse = Type.Array(holdingResponse);
