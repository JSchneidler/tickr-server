import { FastifyRequest } from "fastify";

import { getUser } from "./user.service";
import { getTokensForUser, getToken } from "../token/token.service";
import { GetTokenParams } from "../token/token.schema";
import { getHoldingsForUser } from "../holding/holding.service";
import { getOrdersForUser } from "../order/order.service";

export async function getMeHandler(req: FastifyRequest) {
  return getUser(req.user!.id); // eslint-disable-line @typescript-eslint/no-non-null-assertion
}

export async function getMyTokensHandler(req: FastifyRequest) {
  return getTokensForUser(req.user!.id); // eslint-disable-line @typescript-eslint/no-non-null-assertion
}
export async function getMyTokenHandler(
  req: FastifyRequest<{ Params: GetTokenParams }>,
) {
  return getToken(req.params.tokenId);
}

export async function getMyHoldingsHandler(req: FastifyRequest) {
  return getHoldingsForUser(req.user!.id); // eslint-disable-line @typescript-eslint/no-non-null-assertion
}
// TODO: Do we need this? If so, bug. getHolding takes holdingId, not userId
// export async function getMyHoldingHandler(
//   req: FastifyRequest<{ Params: GetHoldingParams }>,
// ) {
//   return getHolding(req.user!.id); // eslint-disable-line @typescript-eslint/no-non-null-assertion
// }

export async function getMyOrdersHandler(req: FastifyRequest) {
  return getOrdersForUser(req.user!.id); // eslint-disable-line @typescript-eslint/no-non-null-assertion
}
// TODO: Do we need this? If so, bug. getHolding takes holdingId, not userId
// export async function getMyOrderHandler(
//   req: FastifyRequest<{ Params: GetOrderParams }>,
// ) {
//   return getOrder(req.user!.id); // eslint-disable-line @typescript-eslint/no-non-null-assertion
// }
