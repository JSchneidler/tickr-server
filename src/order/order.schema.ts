import { OrderDirection, OrderType, Prisma } from "@prisma/client";
import {
  Number,
  Object,
  String,
  Optional,
  Enum,
  Pick,
  Boolean,
  Union,
  Null,
  Array,
  type Static,
} from "@sinclair/typebox";
import { userId } from "../user/user.schema";
import { coinId } from "../coin/coin.schema";

// Prisma
export type OrderCreateInput = Omit<Prisma.OrderCreateInput, "User" | "Coin">;

// API
export const orderId = Number();

export const getOrderParams = Object({
  orderId,
});
export type GetOrderParams = Static<typeof getOrderParams>;

export const createOrderRequestBody = Object({
  coinId: Number(),
  shares: String(),
  price: Optional(String()),
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

export const orderResponse = Object({
  ...createOrderRequestBody.properties,
  id: orderId,
  userId,
  coinId,
  filled: Boolean(),
  sharePrice: Union([String(), Null()]),
  totalPrice: Union([String(), Null()]),
  createdAt: String(),
  updatedAt: String(),
  deletedAt: Optional(String()),
});
export const ordersResponse = Array(orderResponse);
