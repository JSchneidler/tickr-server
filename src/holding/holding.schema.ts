import {
  Number,
  Object,
  String,
  Optional,
  Array,
  type Static,
} from "@sinclair/typebox";
import { userId } from "../user/user.schema";
import { coinId } from "../coin/coin.schema";

// API
export const holdingId = Number();

export const getHoldingParams = Object({
  holdingId,
});
export type GetHoldingParams = Static<typeof getHoldingParams>;

export const updateHoldingRequestBody = Object({
  shares: String(),
});
export type UpdateHoldingRequestBody = Static<typeof updateHoldingRequestBody>;

export const holdingResponse = Object({
  ...updateHoldingRequestBody.properties,
  id: holdingId,
  userId,
  coinId,
  createdAt: String(),
  updatedAt: String(),
  deletedAt: Optional(String()),
});
export const holdingsResponse = Array(holdingResponse);
