import { FastifyInstance } from "fastify";
import { Type } from "@sinclair/typebox";

import {
  getUsersHandler,
  getUserHandler,
  updateUserHandler,
  deleteUserHandler,
} from "./user.controller";

import tokens from "../token/token.routes";
import holdings from "../holding/holding.routes";

import {
  usersResponseSchema,
  userResponseSchema,
  getUserSchema,
  updateUserSchema,
} from "./user.schema";
import { errorResponseSchemas } from "../error_responses.schema";

export default function (f: FastifyInstance) {
  f.register(tokens, { prefix: "/:user_id/tokens" });
  f.register(holdings, { prefix: "/:user_id/holdings" });

  f.get(
    "/",
    {
      onRequest: [f.authenticate],
      schema: {
        response: {
          ...errorResponseSchemas,
          200: usersResponseSchema,
        },
      },
    },
    getUsersHandler,
  );

  f.get(
    "/:user_id",
    {
      onRequest: [f.authenticate],
      schema: {
        params: getUserSchema,
        response: {
          ...errorResponseSchemas,
          200: userResponseSchema,
        },
      },
    },
    getUserHandler,
  );

  f.put(
    "/:user_id",
    {
      onRequest: [f.authenticate],
      schema: {
        params: getUserSchema,
        body: updateUserSchema,
        response: {
          ...errorResponseSchemas,
          200: userResponseSchema,
        },
      },
    },
    updateUserHandler,
  );

  f.delete(
    "/:user_id",
    {
      onRequest: [f.authenticate],
      schema: {
        params: getUserSchema,
        response: {
          ...errorResponseSchemas,
          200: Type.Number(),
        },
      },
    },
    deleteUserHandler,
  );
}
