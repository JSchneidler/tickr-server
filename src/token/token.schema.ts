import { Prisma } from "@prisma/client";
import {
  Object as TObj,
  String as TStr,
  Number as TNum,
  Array as TArr,
  Union,
  Null,
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
const tokenId = TNum();
export const getTokenParams = TObj({
  tokenId,
});
export type GetTokenParams = Static<typeof getTokenParams>;

export const createTokenRequestBody = TObj({
  name: TStr({ minLength: 1 }),
});
export type CreateTokenRequestBody = Static<typeof createTokenRequestBody>;

export const tokenResponse = TObj({
  ...createTokenRequestBody.properties,
  id: tokenId,
  userId: userId,
  createdAt: TStr(),
  revokedAt: Union([TStr(), Null()]),
});
export const tokensResponse = TArr(tokenResponse);
