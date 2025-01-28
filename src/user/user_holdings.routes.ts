import { FastifyInstance } from "fastify";

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
      onRequest: [f.admin],
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
      onRequest: [f.admin],
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

  f.patch(
    "/:holdingId",
    {
      onRequest: [f.admin],
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
      onRequest: [f.admin],
      schema: {
        params: getHoldingParams,
        response: {
          ...errorResponseSchemas,
        },
      },
    },
    deleteUserHoldingHandler,
  );
}
