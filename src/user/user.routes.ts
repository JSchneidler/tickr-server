import { FastifyInstance } from "fastify";

import {
  getUsersHandler,
  getUserHandler,
  updateUserHandler,
  deleteUserHandler,
} from "./user.controller";
import tokenRoutes from "./user_token.routes";
import holdingRoutes from "./user_holdings.routes";
import orderRoutes from "./user_order.routes";

import { errorResponseSchemas } from "../error_responses.schema";
import {
  getUserParams,
  updateUserRequestBody,
  usersResponse,
  userResponse,
} from "./user.schema";

export default async function (f: FastifyInstance) {
  await f.register(tokenRoutes, { prefix: "/token" });
  await f.register(holdingRoutes, { prefix: "/holding" });
  await f.register(orderRoutes, { prefix: "/order" });

  f.get(
    "/",
    {
      onRequest: [f.admin],
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
      onRequest: [f.admin],
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

  f.patch(
    "/:userId",
    {
      onRequest: [f.admin],
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
      onRequest: [f.admin],
      schema: {
        params: getUserParams,
        response: {
          ...errorResponseSchemas,
        },
      },
    },
    deleteUserHandler,
  );
}
