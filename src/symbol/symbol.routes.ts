import { FastifyInstance } from "fastify";

import { errorResponseSchemas } from "../error_responses.schema";

import {
  getSymbolsHandler,
  getSymbolHandler,
  searchSymbolsHandler,
} from "./symbol.controller";
import {
  getSymbolSchema,
  searchSymbolsResponseSchema,
  searchSymbolsSchema,
  symbolResponseSchema,
  symbolsResponseSchema,
} from "./symbol.schema";

export default function (f: FastifyInstance) {
  f.get(
    "/",
    {
      schema: {
        response: {
          ...errorResponseSchemas,
          200: symbolsResponseSchema,
        },
      },
    },
    getSymbolsHandler,
  );

  f.get(
    "/:symbol_id",
    {
      schema: {
        params: getSymbolSchema,
        response: {
          ...errorResponseSchemas,
          200: symbolResponseSchema,
        },
      },
    },
    getSymbolHandler,
  );

  f.get(
    "/search/:text",
    {
      schema: {
        params: searchSymbolsSchema,
        // response: {
        //   ...errorResponseSchemas,
        //   200: searchSymbolsResponseSchema,
        // },
      },
    },
    searchSymbolsHandler,
  );
}
