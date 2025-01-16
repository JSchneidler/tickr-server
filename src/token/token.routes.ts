import { FastifyInstance } from "fastify";
import { Type } from "@sinclair/typebox";

import {
  tokenResponseSchema,
  tokensResponseSchema,
  createTokenSchema,
  getTokenSchema,
} from "./token.schema";
import { errorResponseSchemas } from "../error_responses.schema";

import {
  createTokenHandler,
  getTokensHandler,
  getTokenHandler,
  revokeTokenHandler,
} from "./token.controller";

export default function (f: FastifyInstance) {
  f.post(
    "/",
    {
      schema: {
        body: createTokenSchema,
        response: {
          ...errorResponseSchemas,
          201: tokenResponseSchema,
        },
      },
    },
    createTokenHandler,
  );

  f.get(
    "/",
    {
      schema: {
        response: {
          ...errorResponseSchemas,
          200: tokensResponseSchema,
        },
      },
    },
    getTokensHandler,
  );

  f.get(
    "/:token_id",
    {
      schema: {
        params: getTokenSchema,
        response: {
          ...errorResponseSchemas,
          200: tokensResponseSchema,
        },
      },
    },
    getTokenHandler,
  );

  f.delete(
    "/:token_id",
    {
      schema: {
        params: getTokenSchema,
        response: {
          ...errorResponseSchemas,
          200: Type.Number(),
        },
      },
    },
    revokeTokenHandler,
  );
}
