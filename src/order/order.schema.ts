import { Type, type Static } from "@sinclair/typebox";

enum OrderDirection {
  BUY,
  SELL,
}

enum OrderType {
  MARKET,
  LIMIT,
  STOP,
  TRAILING_STOP,
}

const orderCore = {
  symbol: Type.String(),
  shares: Type.Number(),
  price: Type.Number(),

  direction: Type.Enum(OrderDirection),
  type: Type.Enum(OrderType),
};

export const orderResponseSchema = Type.Object({
  ...orderCore,
  id: Type.Number(),
  filled: Type.Boolean(),
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

export const updateOrderSchema = Type.Object(
  Type.Omit(createOrderSchema, ["symbol", "price", "direction"]),
);
export type UpdateOrderInput = Static<typeof updateOrderSchema>;
