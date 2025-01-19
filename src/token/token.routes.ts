import { FastifyInstance } from "fastify";
import { Type } from "@sinclair/typebox";

import { errorResponseSchemas } from "../error_responses.schema";

import {
  createTokenHandler,
  getTokensHandler,
  getTokenHandler,
  revokeTokenHandler,
} from "./token.controller";
import {
  createTokenRequestBody,
  getTokenParams,
  tokenResponse,
  tokensResponse,
} from "./token.schema";

export default function (f: FastifyInstance) {
  f.post(
    "/",
    {
      schema: {
        body: createTokenRequestBody,
        response: {
          ...errorResponseSchemas,
          201: tokenResponse,
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
          200: tokensResponse,
        },
      },
    },
    getTokensHandler,
  );

  f.get(
    "/:tokenId",
    {
      schema: {
        params: getTokenParams,
        response: {
          ...errorResponseSchemas,
          200: tokensResponse,
        },
      },
    },
    getTokenHandler,
  );

  f.delete(
    "/:tokenId",
    {
      schema: {
        params: getTokenParams,
        response: {
          ...errorResponseSchemas,
          200: Type.Number(),
        },
      },
    },
    revokeTokenHandler,
  );
}
