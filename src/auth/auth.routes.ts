import { FastifyInstance } from "fastify";

import { errorResponseSchemas } from "../error_responses.schema";
import {
  createUserSchema,
  loginResponseSchema,
  loginSchema,
  userResponseSchema,
} from "../user/user.schema";
import { registerHandler, loginHandler } from "./auth.controller";

export default function (f: FastifyInstance) {
  f.post(
    "/register",
    {
      schema: {
        body: createUserSchema,
        response: {
          ...errorResponseSchemas,
          201: loginResponseSchema,
        },
      },
    },
    registerHandler,
  );

  f.post(
    "/login",
    {
      schema: {
        body: loginSchema,
        response: {
          ...errorResponseSchemas,
          200: loginResponseSchema,
        },
      },
    },
    loginHandler,
  );

  f.get(
    "/check",
    {
      onRequest: [f.authenticate],
      schema: {
        response: {
          ...errorResponseSchemas,
          200: userResponseSchema,
        },
      },
    },
    (req) => req.user,
  );
}
