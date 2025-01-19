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

import { errorResponseSchemas } from "../error_responses.schema";
import {
  getUserParams,
  updateUserRequestBody,
  usersResponse,
  userResponse,
} from "./user.schema";

export default async function (f: FastifyInstance) {
  await f.register(tokenRoutes, { prefix: "/:userId/tokens" });
  await f.register(holdingRoutes, { prefix: "/:userId/holdings" });
  await f.register(orderRoutes, { prefix: "/:userId/orders" });

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
    getUsersHandler,
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
    getUserHandler,
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
    updateUserHandler,
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
    deleteUserHandler,
  );
}
