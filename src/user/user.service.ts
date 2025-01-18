import db from "../db";
import { CreateUserInput, UpdateUserInput } from "./user.schema";
import { hashPassword } from "../auth";
import { createToken } from "../token/token.service";

// TODO: Get from DB based on mode
const DEFAULT_BALANCE = 100000;

export async function createUser(data: CreateUserInput) {
  const password_hash = await hashPassword(data.password);

  // TODO: Make user+key creation into transaction
  const user = await db.user.create({
    data: {
      name: data.name,
      email: data.email,
      balance: DEFAULT_BALANCE,
      deposits: DEFAULT_BALANCE,
      password_hash: password_hash.hash,
      salt: password_hash.salt,
    },
  });

  const { token } = await createToken("default", user);

  return { user, token };
}

export async function getUsers() {
  return await db.user.findMany();
}

export async function getUser(id: number) {
  return await db.user.findUniqueOrThrow({ where: { id } });
}

export async function updateUser(id: number, data: UpdateUserInput) {
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
