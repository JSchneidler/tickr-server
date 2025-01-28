import { FastifyReply, FastifyRequest } from "fastify";
import { Role } from "@prisma/client";
import { GetUserParams } from "./user.schema";
import {
  getToken,
  getTokensForUser,
  revokeToken,
} from "../token/token.service";
import { GetTokenParams } from "../token/token.schema";

export async function getUserTokensHandler(
  req: FastifyRequest<{ Params: GetUserParams }>,
  rep: FastifyReply,
) {
  if (req.user?.role === Role.ADMIN)
    return await getTokensForUser(req.params.userId);
  else rep.code(403).send("Insufficient permission");
}

export async function getUserTokenHandler(
  req: FastifyRequest<{ Params: GetTokenParams }>,
  rep: FastifyReply,
) {
  if (req.user?.role === Role.ADMIN) return await getToken(req.params.tokenId);
  else rep.code(403).send("Insufficient permission");
}

export async function revokeUserTokenHandler(
  req: FastifyRequest<{ Params: GetTokenParams }>,
  rep: FastifyReply,
) {
  if (req.user?.role === Role.ADMIN) {
    await revokeToken(req.params.tokenId);
  } else rep.code(403).send("Insufficient permission");
}
