import { Type } from "@sinclair/typebox";

import { FastifyTypeBox } from "fastify-typebox";

import { banUser, getHoldingsForUser } from "db/admin";

export default function (f: FastifyTypeBox) {
  f.get(
    "/ban/:user_id",
    {
      schema: {
        params: Type.Object({
          user_id: Type.String(),
        }),
      },
    },
    (req) => banUser(req.params.user_id),
  );

  f.get(
    "/holdings/:user_id",
    {
      schema: {
        params: Type.Object({
          user_id: Type.String(),
        }),
      },
    },
    (req) => getHoldingsForUser(req.params.user_id),
  );
}
