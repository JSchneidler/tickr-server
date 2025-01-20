import {
  Number,
  Object,
  String,
  Union,
  Null,
  Optional,
  Array,
  type Static,
} from "@sinclair/typebox";

// API
export const coinId = Number();

export const getCoinParams = Object({
  coinId,
});
export type GetCoinParams = Static<typeof getCoinParams>;

export const coinResponse = Object({
  id: coinId,
  externalId: String(),
  name: String(),
  displayName: String(),
  description: Union([String(), Null()]),
  createdAt: String(),
  updatedAt: String(),
  deletedAt: Optional(String()),
});
export const coinsResponse = Array(coinResponse);

// const priceInfoResponse = Object({
//   currentPrice: Union([String(), Null()]),
//   openPrice: Union([String(), Null()]),
//   change: Union([String(), Null()]),
//   changePercent: Union([String(), Null()]),
//   dayHigh: Union([String(), Null()]),
//   dayLow: Union([String(), Null()]),
//   previousClose: Union([String(), Null()]),
// });

export const fullCoinResponse = Object({
  ...coinResponse.properties,
  // ...priceInfoResponse.properties,
});
export type FullCoinResponse = Static<typeof fullCoinResponse>;
