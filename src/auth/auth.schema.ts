import { Type } from "@sinclair/typebox";

import {
  UserWithoutSensitive,
  createUserRequestBody,
  CreateUserRequestBody,
  userResponse,
} from "../user/user.schema";

// Prisma
export interface UserWithToken {
  user: UserWithoutSensitive;
  token: string;
}

// API
export { createUserRequestBody as loginRequestBody };
export type LoginRequestBody = CreateUserRequestBody;

export const loginResponse = Type.Object({
  token: Type.String(),
  user: userResponse,
});
