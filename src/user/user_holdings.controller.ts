import { FastifyReply, FastifyRequest } from "fastify";
import { Role } from "../generated/prisma/client";

import {
  getHoldingsForUser,
  getHolding,
  updateHolding,
  deleteHolding,
} from "../holding/holding.service";
import { GetUserParams } from "./user.schema";
import {
  GetHoldingParams,
  UpdateHoldingRequestBody,
} from "../holding/holding.schema";

export async function getUserHoldingsHandler(
  req: FastifyRequest<{ Params: GetUserParams }>,
  rep: FastifyReply,
) {
  if (req.user?.role === Role.ADMIN)
    return await getHoldingsForUser(req.params.userId);
  else rep.code(403).send("Insufficient permission");
}

export async function getUserHoldingHandler(
  req: FastifyRequest<{ Params: GetHoldingParams }>,
  rep: FastifyReply,
) {
  if (req.user?.role === Role.ADMIN)
    return await getHolding(req.params.holdingId);
  else rep.code(403).send("Insufficient permission");
}

export async function updateUserHoldingHandler(
  req: FastifyRequest<{
    Params: GetHoldingParams;
    Body: UpdateHoldingRequestBody;
  }>,
  rep: FastifyReply,
) {
  if (req.user?.role === Role.ADMIN)
    return await updateHolding(req.params.holdingId, req.body);
  else rep.code(403).send("Insufficient permission");
}

export async function deleteUserHoldingHandler(
  req: FastifyRequest<{ Params: GetHoldingParams }>,
  rep: FastifyReply,
) {
  if (req.user?.role === Role.ADMIN) {
    await deleteHolding(req.params.holdingId);
  } else rep.code(403).send("Insufficient permission");
}
