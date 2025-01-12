import { Type } from "@sinclair/typebox";

import { FastifyTypeBox } from "../fastify-typebox";
import { ERROR_RESPONSE_SCHEMAS } from "./errors";

import {
  createApiKey,
  getApiKeys,
  getApiKey,
  revokeApiKey,
} from "../db/api_keys";

const API_RESPONSE_SCHEMA = Type.Object({
  id: Type.Number(),

  name: Type.String(),

  createdAt: Type.String(),
  revokedAt: Type.String(),
});

export default function (f: FastifyTypeBox) {
  f.post(
    "/",
    {
      schema: {
        body: Type.Object({
          name: Type.String(),
        }),
        response: {
          ...ERROR_RESPONSE_SCHEMAS,
          201: API_RESPONSE_SCHEMA,
        },
      },
    },
    (req) => createApiKey(req.body),
  );

  f.get(
    "/",
    {
      schema: {
        querystring: Type.Object({
          limit: Type.Integer({ minimum: 1, maximum: 100 }),
        }),
        response: {
          ...ERROR_RESPONSE_SCHEMAS,
          200: Type.Array(API_RESPONSE_SCHEMA),
        },
      },
    },
    getApiKeys,
  );

  f.get(
    "/:api_key_id",
    {
      schema: {
        params: Type.Object({
          api_key_id: Type.Number(),
        }),
        response: {
          ...ERROR_RESPONSE_SCHEMAS,
          200: API_RESPONSE_SCHEMA,
        },
      },
    },
    (req) => getApiKey(req.params.api_key_id),
  );

  f.delete(
    "/:api_key_id",
    {
      schema: {
        params: Type.Object({
          api_key_id: Type.Number(),
        }),
        response: {
          ...ERROR_RESPONSE_SCHEMAS,
          200: Type.Number(),
        },
      },
    },
    (req) => revokeApiKey(req.params.api_key_id),
  );
}
