import { Type, type Static } from "@sinclair/typebox";

const tokenCore = {
  name: Type.String(),
};
export const createTokenSchema = Type.Object(tokenCore);
export type CreateTokenInput = Static<typeof createTokenSchema>;

export const tokenResponseSchema = Type.Object({
  ...tokenCore,
  id: Type.Number(),
  userId: Type.Number(),
  createdAt: Type.String(),
  revokedAt: Type.Optional(Type.String()),
});
export type TokenResponse = Static<typeof tokenResponseSchema>;

export const tokensResponseSchema = Type.Array(tokenResponseSchema);
export type TokensResponse = Static<typeof tokensResponseSchema>;

export const getTokenSchema = Type.Object({ token_id: Type.Number() });
export type GetTokenInput = Static<typeof getTokenSchema>;
