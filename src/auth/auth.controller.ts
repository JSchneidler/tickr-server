import { FastifyReply, FastifyRequest } from "fastify";

import { createUser } from "../user/user.service";
import { CreateUserRequestBody, UserCreateInput } from "../user/user.schema";
import { LoginRequestBody } from "./auth.schema";
import { login } from "./auth.service";

export async function registerHandler(
  req: FastifyRequest<{ Body: CreateUserRequestBody }>,
) {
  const user: UserCreateInput = req.body;
  return await createUser(user);
}

export async function loginHandler(
  req: FastifyRequest<{ Body: LoginRequestBody }>,
  rep: FastifyReply,
) {
  try {
    return await login(req.body.email, req.body.password);
  } catch (error) {
    console.error(error);
    rep.code(401).send("Unauthorized");
  }
}
