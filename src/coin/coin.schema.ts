import {
  Number as TNum,
  Object as TObj,
  String as TStr,
  Array as TArr,
  Union,
  Null,
  type Static,
} from "@sinclair/typebox";

// API
export const coinId = TNum();

export const getCoinParams = TObj({
  coinId,
});
export type GetCoinParams = Static<typeof getCoinParams>;

export const coinResponse = TObj({
  id: coinId,
  externalId: TStr(),
  name: TStr(),
  displayName: TStr(),
  imageUrl: TStr(),
  description: Union([TStr(), Null()]),
  createdAt: TStr(),
  updatedAt: TStr(),
  deletedAt: Union([TStr(), Null()]),
});
export const coinsResponse = TArr(coinResponse);

const historicalData = TArr(TArr(TNum(), { maxItems: 2, minItems: 2 }));
export const coinHistoricalDataResponse = TObj({
  prices: historicalData,
  marketCaps: historicalData,
  totalVolumes: historicalData,
});
export type CoinHistoricalDataResponse = Static<
  typeof coinHistoricalDataResponse
>;

const priceInfoResponse = TObj({
  currentPrice: Union([TStr(), Null()]),
  openPrice: Union([TStr(), Null()]),
  dayHigh: Union([TStr(), Null()]),
  dayLow: Union([TStr(), Null()]),
  previousClose: Union([TStr(), Null()]),
  change: Union([TStr(), Null()]),
  changePercent: Union([TStr(), Null()]),
});

export const fullCoinResponse = TObj({
  ...coinResponse.properties,
  ...priceInfoResponse.properties,
});
export type FullCoinResponse = Static<typeof fullCoinResponse>;
