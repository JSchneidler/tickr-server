import { Prisma } from "@prisma/client";
import {
  Number,
  Object,
  String,
  Partial,
  Required,
  Omit,
  Optional,
  Array,
  type Static,
} from "@sinclair/typebox";

// Prisma
export type UserWithoutSensitive = Prisma.UserGetPayload<{
  omit: { password_hash: true; salt: true };
}>;

export interface UserCreateInput
  extends Omit<Prisma.UserCreateInput, "password_hash" | "salt"> {
  password: string;
}

export interface UserUpdateInput extends Prisma.UserUpdateInput {
  password: string;
}

// API
export const userId = Number();

export const getUserParams = Object({
  userId,
});
export type GetUserParams = Static<typeof getUserParams>;

export const createUserRequestBody = Object({
  email: String({ minLength: 5 }),
  name: String({ minLength: 1 }),
  password: String({ minLength: 10 }),
});
export type CreateUserRequestBody = Static<typeof createUserRequestBody>;

export const updateUserRequestBody = Object({
  ...Partial(createUserRequestBody).properties,
  role: String(),
});

export const userResponse = Object({
  ...Required(Omit(updateUserRequestBody, ["password"])).properties,
  id: userId,
  deposits: String(),
  balance: String(),
  createdAt: String(),
  updatedAt: String(),
  deletedAt: Optional(String()),
});
export const usersResponse = Array(userResponse);
