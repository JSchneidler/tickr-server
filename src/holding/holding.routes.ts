import { FastifyInstance } from "fastify";

import { errorResponseSchemas } from "../error_responses.schema";

import { getHoldingsHandler, getHoldingHandler } from "./holding.controller";
import {
  getHoldingSchema,
  holdingResponseSchema,
  holdingsResponseSchema,
} from "./holding.schema";

export default function (f: FastifyInstance) {
  f.get(
    "/",
    {
      schema: {
        response: {
          ...errorResponseSchemas,
          200: holdingsResponseSchema,
        },
      },
    },
    getHoldingsHandler,
  );

  f.get(
    "/:holding_id",
    {
      schema: {
        params: getHoldingSchema,
        response: {
          ...errorResponseSchemas,
          200: holdingResponseSchema,
        },
      },
    },
    getHoldingHandler,
  );
}
