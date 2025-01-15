import { randomBytes } from "node:crypto";
import { Type } from "@sinclair/typebox";

import { FastifyTypeBox } from "../fastify-typebox";
import fastifyPassport, { pbkdf2Async } from "../auth";
import { ERROR_RESPONSE_SCHEMAS } from "./errors";
import { USER_RESPONSE_SCHEMA } from "./users";
import { createUser } from "../db/users";

export default function (f: FastifyTypeBox) {
  // @ts-expect-error Decimal is assignable to type number
  f.post(
    "/register",
    {
      schema: {
        body: Type.Object({
          email: Type.String(),
          name: Type.String(),
          password: Type.String(),
        }),
        response: {
          ...ERROR_RESPONSE_SCHEMAS,
          201: USER_RESPONSE_SCHEMA,
        },
      },
    },
    async (req) => {
      const salt = randomBytes(16);
      const password_hash = await pbkdf2Async(
        req.body.password,
        salt,
        310000,
        32,
        "sha256",
      );
      return await createUser({
        email: req.body.email,
        name: req.body.name,
        password_hash,
        salt,
      });
    },
  );

  f.post(
    "/login",
    { preValidation: fastifyPassport.authenticate("local") },
    () => "Hi",
  );
  f.post(
    "/logout",
    { preValidation: fastifyPassport.authenticate("local") },
    async (req) => {
      await req.logout();
    },
  );
}
