import { Prisma } from "@prisma/client";
import { Type, type Static } from "@sinclair/typebox";
import { userId } from "../user/user.schema";

// Prisma
export type TokenWithoutSensitive = Prisma.AccessTokenGetPayload<{
  omit: { token_hash: true };
}>;

export interface CreateToken {
  accessToken: TokenWithoutSensitive;
  token: string;
}

// API
const tokenId = Type.Number();
export const getTokenParams = Type.Object({
  tokenId,
});
export type GetTokenParams = Static<typeof getTokenParams>;

export const createTokenRequestBody = Type.Object({
  name: Type.String({ minLength: 1 }),
});
export type CreateTokenRequestBody = Static<typeof createTokenRequestBody>;

export const tokenResponse = Type.Object({
  ...createTokenRequestBody.properties,
  id: tokenId,
  userId: userId,
  createdAt: Type.String(),
  revokedAt: Type.Union([Type.String(), Type.Null()]),
});
export const tokensResponse = Type.Array(tokenResponse);
