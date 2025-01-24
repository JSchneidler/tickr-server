import { FastifyInstance } from "fastify";

import { errorResponseSchemas } from "../error_responses.schema";

import {
  getCoinsHandler,
  getCoinHandler,
  getCoinHistoricalDataHandler,
} from "./coin.controller";
import {
  fullCoinResponse,
  getCoinParams,
  coinsResponse,
  coinHistoricalDataResponse,
} from "./coin.schema";

export default function (f: FastifyInstance) {
  f.get(
    "/",
    {
      schema: {
        response: {
          ...errorResponseSchemas,
          200: coinsResponse,
        },
      },
    },
    getCoinsHandler,
  );

  f.get(
    "/:coinId",
    {
      schema: {
        params: getCoinParams,
        response: {
          ...errorResponseSchemas,
          200: fullCoinResponse,
        },
      },
    },
    getCoinHandler,
  );

  f.get(
    "/:coinId/historical",
    {
      schema: {
        params: getCoinParams,
        response: {
          ...errorResponseSchemas,
          200: coinHistoricalDataResponse,
        },
      },
    },
    getCoinHistoricalDataHandler,
  );
}
