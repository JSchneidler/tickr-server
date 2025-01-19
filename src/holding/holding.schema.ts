import {
  Number,
  Object,
  String,
  Optional,
  Array,
  type Static,
} from "@sinclair/typebox";
import { userId } from "../user/user.schema";
import { symbolId } from "../symbol/symbol.schema";

// API
export const holdingId = Number();

export const getHoldingParams = Object({
  holdingId,
});
export type GetHoldingParams = Static<typeof getHoldingParams>;

export const holdingResponse = Object({
  id: holdingId,
  userId,
  symbolId,
  createdAt: String(),
  updatedAt: String(),
  deletedAt: Optional(String()),
});
export const holdingsResponse = Array(holdingResponse);
