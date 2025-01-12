import { Type } from "@sinclair/typebox";

import { FastifyTypeBox } from "fastify-typebox";

import { createApiKey, getApiKeys, getApiKey, revokeApiKey } from "db/api_keys";

export default function (f: FastifyTypeBox) {
  f.post(
    "/",
    {
      schema: {
        body: Type.Object({
          name: Type.String(),
        }),
      },
    },
    (req) => createApiKey(req.body),
  );

  f.get("/", getApiKeys);

  f.get(
    "/:api_key_id",
    {
      schema: {
        params: Type.Object({
          api_key_id: Type.Number(),
        }),
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
      },
    },
    (req) => revokeApiKey(req.params.api_key_id),
  );
}
