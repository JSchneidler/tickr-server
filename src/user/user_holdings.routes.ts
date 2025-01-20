import { FastifyInstance } from "fastify";
import { Type } from "@sinclair/typebox";

import { errorResponseSchemas } from "../error_responses.schema";
import {
  getHoldingParams,
  holdingResponse,
  holdingsResponse,
  updateHoldingRequestBody,
} from "../holding/holding.schema";
import {
  deleteUserHoldingHandler,
  getUserHoldingHandler,
  getUserHoldingsHandler,
  updateUserHoldingHandler,
} from "./user_holdings.controller";

export default function (f: FastifyInstance) {
  f.get(
    "/",
    {
      onRequest: [f.authenticate],
      schema: {
        response: {
          ...errorResponseSchemas,
          200: holdingsResponse,
        },
      },
    },
    getUserHoldingsHandler,
  );

  f.get(
    "/:holdingId",
    {
      onRequest: [f.authenticate],
      schema: {
        params: getHoldingParams,
        response: {
          ...errorResponseSchemas,
          200: holdingResponse,
        },
      },
    },
    getUserHoldingHandler,
  );

  f.put(
    "/:holdingId",
    {
      onRequest: [f.authenticate],
      schema: {
        params: getHoldingParams,
        body: updateHoldingRequestBody,
        response: {
          ...errorResponseSchemas,
          200: holdingResponse,
        },
      },
    },
    updateUserHoldingHandler,
  );

  f.delete(
    "/:holdingId",
    {
      onRequest: [f.authenticate],
      schema: {
        params: getHoldingParams,
        response: {
          ...errorResponseSchemas,
          200: Type.Number(),
        },
      },
    },
    deleteUserHoldingHandler,
  );
}
