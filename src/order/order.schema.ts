import { OrderDirection, OrderType, Prisma } from "@prisma/client";
import {
  Object as TObj,
  String as TStr,
  Number as TNum,
  Array as TArr,
  Optional,
  Enum,
  Pick,
  Boolean,
  Union,
  Null,
  type Static,
} from "@sinclair/typebox";
import { userId } from "../user/user.schema";
import { coinId } from "../coin/coin.schema";
import { Decimal, NullableDecimalType } from "../decimal-type";

// Prisma
export type OrderCreateInput = Omit<Prisma.OrderCreateInput, "User" | "Coin">;

// API
export const orderId = TNum();

export const getOrderParams = TObj({
  orderId,
});
export type GetOrderParams = Static<typeof getOrderParams>;

export const getOrdersQueryParams = TObj({
  active: Optional(Boolean()),
});
export type GetOrdersQueryParams = Static<typeof getOrdersQueryParams>;

export const createOrderRequestBody = TObj({
  coinId,
  shares: Decimal,
  price: Optional(Decimal),
  direction: Enum(OrderDirection),
  type: Enum(OrderType),
});
export type CreateOrderRequestBody = Static<typeof createOrderRequestBody>;

export const updateOrderRequestBody = Pick(createOrderRequestBody, [
  "shares",
  "type",
  "price",
]);
export type UpdateOrderRequestBody = Static<typeof updateOrderRequestBody>;

export const orderResponse = TObj({
  ...createOrderRequestBody.properties,
  id: orderId,
  userId,
  filled: Boolean(),
  shares: Decimal,
  price: NullableDecimalType,
  sharePrice: NullableDecimalType, // TODO: Use decimal type?
  totalPrice: NullableDecimalType,
  createdAt: TStr(),
  updatedAt: TStr(),
  deletedAt: Union([TStr(), Null()]),
});
export const ordersResponse = TArr(orderResponse);
