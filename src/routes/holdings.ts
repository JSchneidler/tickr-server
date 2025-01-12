import { Type } from "@sinclair/typebox";

import { FastifyTypeBox } from "fastify-typebox";

import { getHoldings, getHolding } from "db/holdings";

export default function (f: FastifyTypeBox) {
  f.get("/", () => getHoldings());
  f.get(
    "/:holding_id",
    {
      schema: {
        params: Type.Object({
          holding_id: Type.String(),
        }),
      },
    },
    (req) => getHolding(req.params.holding_id),
  );
}
