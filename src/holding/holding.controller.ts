import { FastifyRequest } from "fastify";

import { getHolding, getHoldings } from "./holding.service";
import { GetHoldingParams } from "./holding.schema";

export async function getHoldingsHandler() {
  return await getHoldings();
}

export async function getHoldingHandler(
  req: FastifyRequest<{ Params: GetHoldingParams }>,
) {
  return await getHolding(req.params.holdingId);
}
