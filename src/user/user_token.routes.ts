import { FastifyInstance } from "fastify";
import { Type } from "@sinclair/typebox";

import { errorResponseSchemas } from "../error_responses.schema";
import {
  getTokenParams,
  tokenResponse,
  tokensResponse,
} from "../token/token.schema";
import {
  getUserTokenHandler,
  getUserTokensHandler,
  revokeUserTokenHandler,
} from "./user_token.controller";

export default function (f: FastifyInstance) {
  f.get(
    "/",
    {
      onRequest: [f.authenticate],
      schema: {
        response: {
          ...errorResponseSchemas,
          200: tokensResponse,
        },
      },
    },
    getUserTokensHandler,
  );

  f.get(
    "/:tokenId",
    {
      onRequest: [f.authenticate],
      schema: {
        params: getTokenParams,
        response: {
          ...errorResponseSchemas,
          200: tokenResponse,
        },
      },
    },
    getUserTokenHandler,
  );

  f.delete(
    "/:tokenId",
    {
      onRequest: [f.authenticate],
      schema: {
        params: getTokenParams,
        response: {
          ...errorResponseSchemas,
          200: Type.Number(),
        },
      },
    },
    revokeUserTokenHandler,
  );
}
