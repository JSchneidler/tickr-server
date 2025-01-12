import { Prisma } from "@prisma/client";

import db from "./db";

export async function createApiKey(data: Prisma.ApiKeyCreateInput) {
  return await db.apiKey.create({ data });
}

export async function getApiKeys() {
  return await db.apiKey.findMany();
}

export async function getApiKey(id: number) {
  return await db.apiKey.findFirstOrThrow({ where: { id } });
}

export async function updateApiKey(id: number, data: Prisma.ApiKeyUpdateInput) {
  return await db.apiKey.update({ where: { id }, data });
}

export async function revokeApiKey(id: number) {
  return await db.apiKey.delete({ where: { id } });
}

export default {
  createApiKey,
  getApiKeys,
  getApiKey,
  updateApiKey,
  revokeApiKey,
};
