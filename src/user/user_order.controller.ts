import { FastifyReply, FastifyRequest } from "fastify";
import { Role } from "@prisma/client";
import {
  deleteOrder,
  getOrder,
  getOrdersForUser,
  updateOrder,
} from "../order/order.service";
import { GetUserParams } from "./user.schema";
import {
  GetOrderParams,
  GetOrdersQueryParams,
  UpdateOrderRequestBody,
} from "../order/order.schema";

export async function getUserOrdersHandler(
  req: FastifyRequest<{
    Params: GetUserParams;
    Querystring: GetOrdersQueryParams;
  }>,
  rep: FastifyReply,
) {
  if (req.user.role === Role.ADMIN)
    return await getOrdersForUser(req.params.userId, req.query.active);
  else rep.code(403).send("Insufficient permission");
}

export async function getUserOrderHandler(
  req: FastifyRequest<{ Params: GetUserParams }>,
  rep: FastifyReply,
) {
  if (req.user.role === Role.ADMIN) return await getOrder(req.params.userId);
  else rep.code(403).send("Insufficient permission");
}

export async function updateUserOrderHandler(
  req: FastifyRequest<{ Params: GetOrderParams; Body: UpdateOrderRequestBody }>,
  rep: FastifyReply,
) {
  if (req.user.role === Role.ADMIN)
    return await updateOrder(req.params.orderId, req.body);
  else rep.code(403).send("Insufficient permission");
}

export async function deleteUserOrderHandler(
  req: FastifyRequest<{ Params: GetOrderParams }>,
  rep: FastifyReply,
) {
  if (req.user.role === Role.ADMIN) {
    await deleteOrder(req.params.orderId);
  } else rep.code(403).send("Insufficient permission");
}
