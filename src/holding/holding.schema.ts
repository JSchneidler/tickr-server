import {
  Object as TObj,
  String as TStr,
  Array as TArr,
  Number as TNum,
  Union,
  Null,
  type Static,
} from "@sinclair/typebox";

import { userId } from "../user/user.schema";
import { coinId } from "../coin/coin.schema";
import { Decimal } from "../decimal-type";

// API
export const holdingId = TNum();

export const getHoldingParams = TObj({
  holdingId,
});
export type GetHoldingParams = Static<typeof getHoldingParams>;

export const updateHoldingRequestBody = TObj({
  shares: Decimal,
  cost: Decimal,
});
export type UpdateHoldingRequestBody = Static<typeof updateHoldingRequestBody>;

export const holdingResponse = TObj({
  ...updateHoldingRequestBody.properties,
  id: holdingId,
  userId,
  coinId,
  createdAt: TStr(),
  updatedAt: TStr(),
  deletedAt: Union([TStr(), Null()]),
});
export const holdingsResponse = TArr(holdingResponse);
