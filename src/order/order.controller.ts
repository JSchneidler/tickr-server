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
  UpdateOrderRequestBody,
} from "./order.schema";

export async function createOrderHandler(
  req: FastifyRequest<{ Body: CreateOrderRequestBody }>,
  rep: FastifyReply,
) {
  const { coinId, ...orderInput } = req.body;

  if (orderInput.shares || orderInput.price)
    return await createOrder(orderInput, req.user!.id, coinId); // eslint-disable-line @typescript-eslint/no-non-null-assertion
  else rep.code(400).send("Must specify shares or price");
}

export async function getOrdersHandler(req: FastifyRequest, rep: FastifyReply) {
  if (req.user?.role === Role.ADMIN) return await getOrders();
  else rep.code(403).send("Insufficient permission");
}

export async function getOrderHandler(
  req: FastifyRequest<{ Params: GetOrderParams }>,
  rep: FastifyReply,
) {
  if (req.user?.role === Role.ADMIN) return await getOrder(req.params.orderId);
  else rep.code(403).send("Insufficient permission");
}

export async function updateOrderHandler(
  req: FastifyRequest<{ Params: GetOrderParams; Body: UpdateOrderRequestBody }>,
  rep: FastifyReply,
) {
  if (req.user?.role === Role.ADMIN)
    return await updateOrder(req.params.orderId, req.body);
  else rep.code(403).send("Insufficient permission");
}

export async function deleteOrderHandler(
  req: FastifyRequest<{ Params: GetOrderParams }>,
  rep: FastifyReply,
) {
  const order = await getOrder(req.params.orderId);

  if (req.user?.id === order.userId || req.user?.role === Role.ADMIN) {
    await deleteOrder(req.params.orderId);
  } else rep.code(403).send("Insufficient permission");
}
