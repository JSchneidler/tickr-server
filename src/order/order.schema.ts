import { OrderDirection, OrderType, Prisma } from "@prisma/client";
import { Type, type Static } from "@sinclair/typebox";
import { userId } from "../user/user.schema";
import { symbolId } from "../symbol/symbol.schema";

// Prisma
export type OrderCreateInput = Omit<Prisma.OrderCreateInput, "User" | "Symbol">;

// API
export const orderId = Type.Number();

export const getOrderParams = Type.Object({
  orderId,
});
export type GetOrderParams = Static<typeof getOrderParams>;

export const createOrderRequestBody = Type.Object({
  symbolId: Type.Number(),
  shares: Type.String(),
  price: Type.Optional(Type.String()),
  direction: Type.Enum(OrderDirection),
  type: Type.Enum(OrderType),
});
export type CreateOrderRequestBody = Static<typeof createOrderRequestBody>;

export const updateOrderRequestBody = Type.Pick(createOrderRequestBody, [
  "shares",
  "type",
  "price",
]);
export type UpdateOrderRequestBody = Static<typeof updateOrderRequestBody>;

export const orderResponse = Type.Object({
  ...createOrderRequestBody.properties,
  id: orderId,
  userId,
  symbolId,
  filled: Type.Boolean(),
  sharePrice: Type.Union([Type.String(), Type.Null()]),
  totalPrice: Type.Union([Type.String(), Type.Null()]),
  createdAt: Type.String(),
  updatedAt: Type.String(),
  deletedAt: Type.Union([Type.String(), Type.Null()]),
});
export const ordersResponse = Type.Array(orderResponse);
