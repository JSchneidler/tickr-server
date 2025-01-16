import { FastifyRequest } from "fastify";

import {
  getOrders,
  getOrder,
  updateOrder,
  deleteOrder,
  createOrder,
} from "./order.service";
import {
  CreateOrderInput,
  GetOrderInput,
  UpdateOrderInput,
} from "./order.schema";

export async function createOrderHandler(
  req: FastifyRequest<{ Body: CreateOrderInput }>,
) {
  return await createOrder(req.body, req.user);
}

export async function getOrdersHandler() {
  return await getOrders();
}

export async function getOrderHandler(
  req: FastifyRequest<{ Params: GetOrderInput }>,
) {
  return await getOrder(req.params.order_id);
}

export async function updateOrderHandler(
  req: FastifyRequest<{ Params: GetOrderInput; Body: UpdateOrderInput }>,
) {
  return await updateOrder(req.params.order_id, req.body);
}

export async function deleteOrderHandler(
  req: FastifyRequest<{ Params: GetOrderInput }>,
) {
  const id = req.params.order_id;
  await deleteOrder(id);
  return id;
}
