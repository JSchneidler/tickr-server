import { FastifyInstance } from "fastify";

import { errorResponseSchemas } from "../error_responses.schema";
import { registerHandler, loginHandler } from "./auth.controller";
import { createUserRequestBody, userResponse } from "../user/user.schema";
import { loginRequestBody, loginResponse } from "./auth.schema";

export default function (f: FastifyInstance) {
  f.post(
    "/register",
    {
      schema: {
        body: createUserRequestBody,
        response: {
          ...errorResponseSchemas,
          201: loginResponse,
        },
      },
    },
    registerHandler,
  );

  f.post(
    "/login",
    {
      schema: {
        body: loginRequestBody,
        response: {
          ...errorResponseSchemas,
          200: loginResponse,
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
          200: userResponse,
        },
      },
    },
    (req) => req.user,
  );
}
