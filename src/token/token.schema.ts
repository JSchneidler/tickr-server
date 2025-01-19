import { Prisma } from "@prisma/client";
import {
  Number,
  Object,
  String,
  Optional,
  Array,
  type Static,
} from "@sinclair/typebox";
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
const tokenId = Number();
export const getTokenParams = Object({
  tokenId,
});
export type GetTokenParams = Static<typeof getTokenParams>;

export const createTokenRequestBody = Object({
  name: String({ minLength: 1 }),
});
export type CreateTokenRequestBody = Static<typeof createTokenRequestBody>;

export const tokenResponse = Object({
  ...createTokenRequestBody.properties,
  id: tokenId,
  userId: userId,
  createdAt: String(),
  revokedAt: Optional(String()),
});
export const tokensResponse = Array(tokenResponse);
