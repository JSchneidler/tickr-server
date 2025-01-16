import { FastifyRequest } from "fastify";

import { getHolding, getHoldings } from "./holding.service";
import { GetHoldingInput } from "./holding.schema";

export async function getHoldingsHandler() {
  return await getHoldings();
}

export async function getHoldingHandler(
  req: FastifyRequest<{ Params: GetHoldingInput }>,
) {
  return await getHolding(req.params.holding_id);
}
