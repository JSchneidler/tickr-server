import { FastifyReply, FastifyRequest } from "fastify";

import { CreateUserInput, LoginInput } from "../user/user.schema";
import { createUser } from "../user/user.service";
import db from "../db";
import { comparePasswordHash } from ".";
import { createToken } from "../token/token.service";

export async function registerHandler(
  req: FastifyRequest<{ Body: CreateUserInput }>,
) {
  return await createUser(req.body);
}

export async function loginHandler(
  req: FastifyRequest<{ Body: LoginInput }>,
  rep: FastifyReply,
) {
  // TODO: Login with username and password, return a JWT
  const user = await db.user.findUniqueOrThrow({
    where: { email: req.body.email },
    omit: { password_hash: false, salt: false },
  });

  if (
    await comparePasswordHash(
      Buffer.from(req.body.password),
      user.salt,
      user.password_hash,
    )
  ) {
    const { token } = await createToken("login", user);
    return {
      user,
      token,
    };
  } else rep.code(401).send("Unauthorized");
}
