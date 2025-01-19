import { FastifyInstance } from "fastify";

import { errorResponseSchemas } from "../error_responses.schema";

import {
  getSymbolsHandler,
  getSymbolHandler,
  searchSymbolsHandler,
} from "./symbol.controller";
import {
  fullSymbolResponse,
  getSymbolParams,
  searchSymbolsParams,
  symbolsResponse,
} from "./symbol.schema";

export default function (f: FastifyInstance) {
  f.get(
    "/",
    {
      schema: {
        response: {
          ...errorResponseSchemas,
          200: symbolsResponse,
        },
      },
    },
    getSymbolsHandler,
  );

  f.get(
    "/:symbolId",
    {
      schema: {
        params: getSymbolParams,
        response: {
          ...errorResponseSchemas,
          200: fullSymbolResponse,
        },
      },
    },
    getSymbolHandler,
  );

  f.get(
    "/search/:text",
    {
      schema: {
        params: searchSymbolsParams,
        response: {
          ...errorResponseSchemas,
          200: symbolsResponse,
        },
      },
    },
    searchSymbolsHandler,
  );
}
