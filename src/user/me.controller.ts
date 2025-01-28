import { FastifyRequest } from "fastify";

import { getUser } from "./user.service";

import { getTokensForUser, getToken } from "../token/token.service";
import { GetTokenParams } from "../token/token.schema";

import { getHoldingsForUser, getHolding } from "../holding/holding.service";
import { GetHoldingParams } from "../holding/holding.schema";

import { getOrdersForUser, getOrder } from "../order/order.service";
import { GetOrderParams } from "../order/order.schema";

export async function getMeHandler(req: FastifyRequest) {
  return await getUser(req.user!.id); // eslint-disable-line @typescript-eslint/no-non-null-assertion
}

export async function getMyTokensHandler(req: FastifyRequest) {
  return await getTokensForUser(req.user!.id); // eslint-disable-line @typescript-eslint/no-non-null-assertion
}
export async function getMyTokenHandler(
  req: FastifyRequest<{ Params: GetTokenParams }>,
) {
  return await getToken(req.params.tokenId);
}

export async function getMyHoldingsHandler(req: FastifyRequest) {
  return await getHoldingsForUser(req.user!.id); // eslint-disable-line @typescript-eslint/no-non-null-assertion
}
export async function getMyHoldingHandler(
  req: FastifyRequest<{ Params: GetHoldingParams }>,
) {
  return await getHolding(req.user!.id); // eslint-disable-line @typescript-eslint/no-non-null-assertion
}

export async function getMyOrdersHandler(req: FastifyRequest) {
  return await getOrdersForUser(req.user!.id); // eslint-disable-line @typescript-eslint/no-non-null-assertion
}
export async function getMyOrderHandler(
  req: FastifyRequest<{ Params: GetOrderParams }>,
) {
  return await getOrder(req.user!.id); // eslint-disable-line @typescript-eslint/no-non-null-assertion
}
