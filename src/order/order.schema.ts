import { OrderDirection, OrderType } from "@prisma/client";
import { Type, type Static } from "@sinclair/typebox";

const orderCore = {
  symbol: Type.String(),
  shares: Type.Number(),
  price: Type.Optional(Type.Number()),

  direction: Type.Enum(OrderDirection),
  type: Type.Enum(OrderType),
};

export const orderResponseSchema = Type.Object({
  ...orderCore,
  id: Type.Number(),
  userId: Type.Number(),
  filled: Type.Boolean(),
  sharePrice: Type.Number(),
  totalPrice: Type.Number(),
  createdAt: Type.String(),
  updatedAt: Type.String(),
  deletedAt: Type.Union([Type.String(), Type.Null()]),
});
export type OrderResponse = Static<typeof orderResponseSchema>;

export const ordersResponseSchema = Type.Array(orderResponseSchema);
export type OrdersResponse = Static<typeof ordersResponseSchema>;

export const createOrderSchema = Type.Object(orderCore);
export type CreateOrderInput = Static<typeof createOrderSchema>;

export const getOrderSchema = Type.Object({ order_id: Type.Number() });
export type GetOrderInput = Static<typeof getOrderSchema>;

export const updateOrderSchema = Type.Omit(createOrderSchema, [
  "symbol",
  "direction",
]);
export type UpdateOrderInput = Static<typeof updateOrderSchema>;
