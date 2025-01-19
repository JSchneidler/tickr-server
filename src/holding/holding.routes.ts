import { FastifyInstance } from "fastify";

import { errorResponseSchemas } from "../error_responses.schema";
import { getHoldingsHandler, getHoldingHandler } from "./holding.controller";
import {
  getHoldingParams,
  holdingResponse,
  holdingsResponse,
} from "./holding.schema";

export default function (f: FastifyInstance) {
  f.get(
    "/",
    {
      schema: {
        response: {
          ...errorResponseSchemas,
          200: holdingsResponse,
        },
      },
    },
    getHoldingsHandler,
  );

  f.get(
    "/:holdingId",
    {
      schema: {
        params: getHoldingParams,
        response: {
          ...errorResponseSchemas,
          200: holdingResponse,
        },
      },
    },
    getHoldingHandler,
  );
}
