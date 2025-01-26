import db from "../db";
import { hashPassword } from "../auth";
import { createToken } from "../token/token.service";
import { UserWithToken } from "../auth/auth.schema";
import {
  UserWithoutSensitive,
  UserCreateInput,
  UserUpdateInput,
} from "./user.schema";

// TODO: Get from DB based on mode?
const DEFAULT_BALANCE = 100000;

export async function createUser(
  userInput: UserCreateInput,
): Promise<UserWithToken> {
  const { hash, salt } = await hashPassword(userInput.password);

  // TODO: Make user+key creation into transaction
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...rest } = userInput;
  const user = await db.user.create({
    data: {
      ...rest,
      balance: DEFAULT_BALANCE,
      deposits: DEFAULT_BALANCE,
      password_hash: hash,
      salt,
    },
  });

  const { token } = await createToken("register", user);

  return { user, token };
}

export async function getUsers(): Promise<UserWithoutSensitive[]> {
  return await db.user.findMany();
}

export async function getUser(id: number): Promise<UserWithoutSensitive> {
  return await db.user.findUniqueOrThrow({ where: { id } });
}

export async function updateUser(
  id: number,
  userUpdates: UserUpdateInput,
): Promise<UserWithoutSensitive> {
  if (userUpdates.password) {
    const { hash, salt } = await hashPassword(userUpdates.password);
    userUpdates.password_hash = hash;
    userUpdates.salt = salt;
  }

  return await db.user.update({ where: { id }, data: userUpdates });
}

export async function deleteUser(id: number): Promise<void> {
  await db.user.delete({ where: { id } });
}
