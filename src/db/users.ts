import { Prisma } from "@prisma/client";

import db from ".";

export async function createUser(data: Prisma.UserCreateInput) {
  return await db.user.create({ data });
}

export async function getUsers() {
  return await db.user.findMany();
}

export async function getUser(id: number) {
  return await db.user.findFirstOrThrow({ where: { id } });
}

export async function updateUser(id: number, data: Prisma.UserUpdateInput) {
  return await db.user.update({ where: { id }, data });
}

export async function deleteUser(id: number) {
  await db.user.delete({ where: { id } });
  return id;
}

export default {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
