import { FastifyInstance } from "fastify";
import { Type } from "@sinclair/typebox";

import {
  getUsersHandler,
  getUserHandler,
  updateUserHandler,
  deleteUserHandler,
} from "./user.controller";

import tokenRoutes from "../token/token.routes";
import holdingRoutes from "../holding/holding.routes";
import orderRoutes from "../order/order.routes";

import {
  usersResponseSchema,
  userResponseSchema,
  getUserSchema,
  updateUserSchema,
} from "./user.schema";
import { errorResponseSchemas } from "../error_responses.schema";

export default async function (f: FastifyInstance) {
  await f.register(tokenRoutes, { prefix: "/:user_id/tokens" });
  await f.register(holdingRoutes, { prefix: "/:user_id/holdings" });
  await f.register(orderRoutes, { prefix: "/orders" });

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
