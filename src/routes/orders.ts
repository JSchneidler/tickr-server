import { Type } from "@sinclair/typebox";

import { FastifyTypeBox } from "../fastify-typebox";

import {
  createOrder,
  getOrders,
  getOrder,
  updateOrder,
  deleteOrder,
} from "../db/orders";

export default function (f: FastifyTypeBox) {
  f.post(
    "/",
    {
      schema: {
        body: Type.Object({
          symbol: Type.String(),
          shares: Type.Number(),
          price: Type.Number(),
        }),
      },
    },
    (req) => createOrder(req.body),
  );

  f.get("/", getOrders);

  f.get(
    "/:order_id",
    {
      schema: {
        params: Type.Object({
          order_id: Type.String(),
        }),
      },
    },
    (req) => getOrder(req.params.order_id),
  );

  f.put(
    "/:order_id",
    {
      schema: {
        params: Type.Object({
          order_id: Type.String(),
        }),
        body: Type.Object({}),
      },
    },
    (req) => updateOrder(req.params.order_id, req.body),
  );

  f.delete(
    "/:order_id",
    {
      schema: {
        params: Type.Object({
          order_id: Type.String(),
        }),
      },
    },
    (req) => deleteOrder(req.params.order_id),
  );
}
