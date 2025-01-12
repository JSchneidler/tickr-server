import { Type } from "@sinclair/typebox";

import { FastifyTypeBox } from "../fastify-typebox";
import { ERROR_RESPONSE_SCHEMAS } from "./errors";
import { USER_RESPONSE_SCHEMA } from "./users";
import { HOLDING_RESPONSE_SCHEMA } from "./holdings";

import { banUser, getHoldingsForUser } from "../db/admin";

export default function (f: FastifyTypeBox) {
  f.get(
    "/ban/:user_id",
    {
      schema: {
        params: Type.Object({
          user_id: Type.String(),
        }),
        response: {
          ...ERROR_RESPONSE_SCHEMAS,
          200: USER_RESPONSE_SCHEMA,
        },
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
        response: {
          ...ERROR_RESPONSE_SCHEMAS,
          200: Type.Array(HOLDING_RESPONSE_SCHEMA),
        },
      },
    },
    (req) => getHoldingsForUser(req.params.user_id),
  );
}
