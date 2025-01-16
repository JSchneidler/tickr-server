import db from "../db";
import { CreateTokenInput } from "./token.schema";
import { generateJwt } from "../auth";
import { UserWithoutSensitive } from "../user/user.schema";

export async function createToken(name: string, user: UserWithoutSensitive) {
  const { token, hash } = await generateJwt(user);

  const access_token = await db.accessToken.create({
    data: { name, token_hash: hash, userId: user.id },
  });

  return {
    id: access_token.id,
    name: access_token.name,
    token,
  };
}

export async function getTokens() {
  return await db.accessToken.findMany();
}

export async function getToken(id: number) {
  return await db.accessToken.findUniqueOrThrow({ where: { id } });
}

export async function updateToken(id: number, data: CreateTokenInput) {
  return await db.accessToken.update({ where: { id }, data });
}

export async function revokeToken(id: number) {
  await db.accessToken.delete({ where: { id } });
  return id;
}

export default {
  createToken,
  getTokens,
  getToken,
  updateToken,
  revokeToken,
};
