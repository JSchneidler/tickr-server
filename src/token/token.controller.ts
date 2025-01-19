import { FastifyRequest } from "fastify";

import { createToken, getToken, getTokens, revokeToken } from "./token.service";
import { CreateTokenRequestBody, GetTokenParams } from "./token.schema";

export async function createTokenHandler(
  req: FastifyRequest<{ Body: CreateTokenRequestBody }>,
) {
  const token = await createToken(req.body.name, req.user);

  return token;
}

export async function getTokensHandler() {
  return await getTokens();
}

export async function getTokenHandler(
  req: FastifyRequest<{ Params: GetTokenParams }>,
) {
  return await getToken(req.params.tokenId);
}

export async function revokeTokenHandler(
  req: FastifyRequest<{ Params: GetTokenParams }>,
): Promise<void> {
  await revokeToken(req.params.tokenId);
}
