import { FastifyRequest } from "fastify";

import { createToken, getToken, getTokens, revokeToken } from "./token.service";
import { CreateTokenInput, GetTokenInput } from "./token.schema";

export async function createTokenHandler(
  req: FastifyRequest<{ Body: CreateTokenInput }>,
) {
  const token = await createToken(req.body.name, req.user);

  return token;
}

export async function getTokensHandler() {
  return await getTokens();
}

export async function getTokenHandler(
  req: FastifyRequest<{ Params: GetTokenInput }>,
) {
  return await getToken(req.params.token_id);
}

export async function revokeTokenHandler(
  req: FastifyRequest<{ Params: GetTokenInput }>,
) {
  return await revokeToken(req.params.token_id);
}
