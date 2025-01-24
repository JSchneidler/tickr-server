import { FastifyRequest, FastifyReply } from "fastify";
import { Role } from "@prisma/client";

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
  GetOrdersQueryParams,
  UpdateOrderRequestBody,
} from "./order.schema";

export async function createOrderHandler(
  req: FastifyRequest<{ Body: CreateOrderRequestBody }>,
) {
  const { coinId, ...orderInput } = req.body;

  return await createOrder(orderInput, req.user.id, coinId);
}

export async function getOrdersHandler(
  req: FastifyRequest<{ Querystring: GetOrdersQueryParams }>,
  rep: FastifyReply,
) {
  if (req.user.role === Role.ADMIN) return await getOrders(req.query.active);
  else rep.code(403).send("Insufficient permission");
}

export async function getOrderHandler(
  req: FastifyRequest<{ Params: GetOrderParams }>,
  rep: FastifyReply,
) {
  if (req.user.role === Role.ADMIN) return await getOrder(req.params.orderId);
  else rep.code(403).send("Insufficient permission");
}

export async function updateOrderHandler(
  req: FastifyRequest<{ Params: GetOrderParams; Body: UpdateOrderRequestBody }>,
  rep: FastifyReply,
) {
  if (req.user.role === Role.ADMIN)
    return await updateOrder(req.params.orderId, req.body);
  else rep.code(403).send("Insufficient permission");
}

export async function deleteOrderHandler(
  req: FastifyRequest<{ Params: GetOrderParams }>,
  rep: FastifyReply,
) {
  if (req.user.role === Role.ADMIN) {
    await deleteOrder(req.params.orderId);
  } else rep.code(403).send("Insufficient permission");
}
