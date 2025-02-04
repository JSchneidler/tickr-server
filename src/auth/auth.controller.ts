import { FastifyReply, FastifyRequest } from "fastify";

import { createUser } from "../user/user.service";
import { CreateUserRequestBody } from "../user/user.schema";
import { LoginRequestBody } from "./auth.schema";
import { login } from "./auth.service";
// import { revokeToken } from "../token/token.service";

export async function registerHandler(
  req: FastifyRequest<{ Body: CreateUserRequestBody }>,
  rep: FastifyReply,
) {
  const { user, token } = await createUser(req.body);
  rep.setCookie("token", token, {
    httpOnly: true,
    sameSite: true,
    signed: true,
    secure: "auto",
  });
  return user;
}

export async function loginHandler(
  req: FastifyRequest<{ Body: LoginRequestBody }>,
  rep: FastifyReply,
) {
  try {
    const { user, token } = await login(req.body.email, req.body.password);
    rep.setCookie("token", token, {
      httpOnly: true,
      sameSite: true,
      signed: true,
      secure: "auto",
    });
    return user;
  } catch (error) {
    console.error(error);
    rep.code(401).send("Unauthorized");
  }
}

export function logoutHandler(req: FastifyRequest, rep: FastifyReply) {
  try {
    // await revokeToken() TODO: Revoke token, get ID somehow
    return rep.clearCookie("token").send();
  } catch (error) {
    console.error(error);
    rep.code(401).send("Unauthorized");
  }
}
