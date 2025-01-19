import { FastifyRequest } from "fastify";

import {
  getOrders,
  getOrder,
  updateOrder,
  deleteOrder,
  createOrder,
} from "./order.service";

import {
  CreateOrderRequestBody,
  GetOrderParams,
  UpdateOrderRequestBody,
} from "./order.schema";

export async function createOrderHandler(
  req: FastifyRequest<{ Body: CreateOrderRequestBody }>,
) {
  const { symbolId, ...orderInput } = req.body;

  return await createOrder(orderInput, req.user.id, symbolId);
}

export async function getOrdersHandler() {
  return await getOrders();
}

export async function getOrderHandler(
  req: FastifyRequest<{ Params: GetOrderParams }>,
) {
  return await getOrder(req.params.orderId);
}

export async function updateOrderHandler(
  req: FastifyRequest<{ Params: GetOrderParams; Body: UpdateOrderRequestBody }>,
) {
  return await updateOrder(req.params.orderId, req.body);
}

export async function deleteOrderHandler(
  req: FastifyRequest<{ Params: GetOrderParams }>,
) {
  const id = req.params.orderId;
  await deleteOrder(id);
  return id;
}
