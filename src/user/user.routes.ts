import { FastifyInstance } from "fastify";
import { Type } from "@sinclair/typebox";

import {
  getUsersHandler,
  getUserHandler,
  updateUserHandler,
  deleteUserHandler,
} from "./user.controller";

import { errorResponseSchemas } from "../error_responses.schema";
import {
  getUserParams,
  updateUserRequestBody,
  usersResponse,
  userResponse,
} from "./user.schema";

export default function (f: FastifyInstance) {
  f.get(
    "/",
    {
      onRequest: [f.authenticate],
      schema: {
        response: {
          ...errorResponseSchemas,
          200: usersResponse,
        },
      },
    },
    getUsersHandler
  );

  f.get(
    "/:userId",
    {
      onRequest: [f.authenticate],
      schema: {
        params: getUserParams,
        response: {
          ...errorResponseSchemas,
          200: userResponse,
        },
      },
    },
    getUserHandler
  );

  f.put(
    "/:userId",
    {
      onRequest: [f.authenticate],
      schema: {
        params: getUserParams,
        body: updateUserRequestBody,
        response: {
          ...errorResponseSchemas,
          200: userResponse,
        },
      },
    },
    updateUserHandler
  );

  f.delete(
    "/:userId",
    {
      onRequest: [f.authenticate],
      schema: {
        params: getUserParams,
        response: {
          ...errorResponseSchemas,
          200: Type.Number(),
        },
      },
    },
    deleteUserHandler
  );
}
