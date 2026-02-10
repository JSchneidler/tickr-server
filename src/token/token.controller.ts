import { FastifyRequest, FastifyReply } from "fastify";
import { Role } from "../generated/prisma/client";

import { createToken, getToken, getTokens, revokeToken } from "./token.service";
import { CreateTokenRequestBody, GetTokenParams } from "./token.schema";

export async function createTokenHandler(
  req: FastifyRequest<{ Body: CreateTokenRequestBody }>,
) {
  const token = await createToken(req.body.name, req.user!); // eslint-disable-line @typescript-eslint/no-non-null-assertion

  return token;
}

export async function getTokensHandler(req: FastifyRequest, rep: FastifyReply) {
  if (req.user?.role === Role.ADMIN) return await getTokens();
  else rep.code(403).send("Insufficient permission");
}

export async function getTokenHandler(
  req: FastifyRequest<{ Params: GetTokenParams }>,
  rep: FastifyReply,
) {
  if (req.user?.role === Role.ADMIN) return await getToken(req.params.tokenId);
  else rep.code(403).send("Insufficient permission");
}

export async function revokeTokenHandler(
  req: FastifyRequest<{ Params: GetTokenParams }>,
  rep: FastifyReply,
): Promise<void> {
  if (req.user?.role === Role.ADMIN) await revokeToken(req.params.tokenId);
  else rep.code(403).send("Insufficient permission");
}
