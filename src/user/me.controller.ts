import { FastifyRequest } from "fastify";

import { getUser } from "./user.service";

import { getTokensForUser, getToken } from "../token/token.service";
import { GetTokenParams } from "../token/token.schema";

import { getHoldingsForUser, getHolding } from "../holding/holding.service";
import { GetHoldingParams } from "../holding/holding.schema";

import { getOrdersForUser, getOrder } from "../order/order.service";
import { GetOrderParams, GetOrdersQueryParams } from "../order/order.schema";

export async function getMeHandler(req: FastifyRequest) {
  return await getUser(req.user.id);
}

export async function getMyTokensHandler(req: FastifyRequest) {
  return await getTokensForUser(req.user.id);
}
export async function getMyTokenHandler(
  req: FastifyRequest<{ Params: GetTokenParams }>,
) {
  return await getToken(req.params.tokenId);
}

export async function getMyHoldingsHandler(req: FastifyRequest) {
  return await getHoldingsForUser(req.user.id);
}
export async function getMyHoldingHandler(
  req: FastifyRequest<{ Params: GetHoldingParams }>,
) {
  return await getHolding(req.user.id);
}

export async function getMyOrdersHandler(
  req: FastifyRequest<{ Querystring: GetOrdersQueryParams }>,
) {
  return await getOrdersForUser(req.user.id, req.query.active);
}
export async function getMyOrderHandler(
  req: FastifyRequest<{ Params: GetOrderParams }>,
) {
  return await getOrder(req.user.id);
}
