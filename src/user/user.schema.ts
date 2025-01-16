import { Type, type Static } from "@sinclair/typebox";
import { Prisma } from "@prisma/client";

// TypeBox
const userCore = {
  email: Type.String(),
  name: Type.String(),
};

export const userResponseSchema = Type.Object({
  ...userCore,
  id: Type.Number(),
  balance: Type.Number(),
  role: Type.String(),
  createdAt: Type.String(),
  updatedAt: Type.String(),
});
export type UserResponse = Static<typeof userResponseSchema>;

export const usersResponseSchema = Type.Array(userResponseSchema);
export type UsersResponse = Static<typeof usersResponseSchema>;

export const createUserSchema = Type.Object({
  ...userCore,
  password: Type.String(),
});
export type CreateUserInput = Static<typeof createUserSchema>;

export const loginSchema = Type.Object({
  email: Type.String(),
  password: Type.String(),
});
export type LoginInput = Static<typeof loginSchema>;

export const loginResponseSchema = Type.Object({
  token: Type.String(),
  user: userResponseSchema,
});
export type LoginResponse = Static<typeof loginResponseSchema>;

export const getUserSchema = Type.Object({ user_id: Type.Number() });
export type GetUserInput = Static<typeof getUserSchema>;

export const updateUserSchema = Type.Object(userCore);
export type UpdateUserInput = Static<typeof updateUserSchema>;

// Prisma
export type UserWithoutSensitive = Prisma.UserGetPayload<{
  omit: { password_hash: true; salt: true };
}>;
