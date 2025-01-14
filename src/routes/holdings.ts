import { Type } from "@sinclair/typebox";

import { FastifyTypeBox } from "../fastify-typebox";
import { ERROR_RESPONSE_SCHEMAS } from "./errors";

import { getHoldings, getHolding } from "../db/holdings";

export const HOLDING_RESPONSE_SCHEMA = Type.Object({
  id: Type.Number(),

  symbol: Type.String(),
  shares: Type.Number(),
  price: Type.Number(),

  createdAt: Type.String(),
  updatedAt: Type.String(),
});

export default function (f: FastifyTypeBox) {
  // @ts-expect-error Decimal is assignable to type number
  f.get(
    "/",
    {
      schema: {
        querystring: Type.Object({
          limit: Type.Integer({ minimum: 1, maximum: 100 }),
        }),
        response: {
          ...ERROR_RESPONSE_SCHEMAS,
          200: Type.Array(HOLDING_RESPONSE_SCHEMA),
        },
      },
    },
    getHoldings,
  );

  // @ts-expect-error Decimal is assignable to type number
  f.get(
    "/:holding_id",
    {
      schema: {
        params: Type.Object({
          holding_id: Type.Number(),
        }),
        response: {
          ...ERROR_RESPONSE_SCHEMAS,
          200: HOLDING_RESPONSE_SCHEMA,
        },
      },
    },
    (req) => getHolding(req.params.holding_id),
  );
}
