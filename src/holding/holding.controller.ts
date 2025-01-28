import { FastifyRequest, FastifyReply } from "fastify";
import { Role } from "@prisma/client";

import { getHolding, getHoldings } from "./holding.service";
import { GetHoldingParams } from "./holding.schema";

export async function getHoldingsHandler(
  req: FastifyRequest,
  rep: FastifyReply,
) {
  if (req.user?.role === Role.ADMIN) return await getHoldings();
  else rep.code(403).send("Insufficient permission");
}

export async function getHoldingHandler(
  req: FastifyRequest<{ Params: GetHoldingParams }>,
  rep: FastifyReply,
) {
  if (req.user?.role === Role.ADMIN)
    return await getHolding(req.params.holdingId);
  else rep.code(403).send("Insufficient permission");
}
