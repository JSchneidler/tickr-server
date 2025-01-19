import { Prisma } from "@prisma/client";
import { Type, type Static } from "@sinclair/typebox";

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
export const userId = Type.Number();

export const getUserParams = Type.Object({
  userId,
});
export type GetUserParams = Static<typeof getUserParams>;

export const createUserRequestBody = Type.Object({
  email: Type.String({ minLength: 5 }),
  name: Type.String({ minLength: 1 }),
  password: Type.String({ minLength: 10 }),
});
export type CreateUserRequestBody = Static<typeof createUserRequestBody>;

export const updateUserRequestBody = Type.Object({
  ...Type.Partial(createUserRequestBody).properties,
  role: Type.String(),
});

export const userResponse = Type.Object({
  ...Type.Required(Type.Omit(updateUserRequestBody, ["password"])).properties,
  id: userId,
  deposits: Type.String(),
  balance: Type.String(),
  createdAt: Type.String(),
  updatedAt: Type.String(),
  deletedAt: Type.Union([Type.String(), Type.Null()]),
});
export const usersResponse = Type.Array(userResponse);
