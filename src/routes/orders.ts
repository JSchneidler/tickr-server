import { Type } from "@sinclair/typebox";

import { FastifyTypeBox } from "../fastify-typebox";
import { ERROR_RESPONSE_SCHEMAS } from "./errors";

import {
  createOrder,
  getOrders,
  getOrder,
  updateOrder,
  deleteOrder,
} from "../db/orders";

const ORDER_RESPONSE_SCHEMA = Type.Object({
  id: Type.Number(),

  symbol: Type.String(),
  shares: Type.Number(),
  price: Type.Number(),

  createdAt: Type.String(),
  updatedAt: Type.String(),
});

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
        response: {
          ...ERROR_RESPONSE_SCHEMAS,
          201: ORDER_RESPONSE_SCHEMA,
        },
      },
    },
    (req) => createOrder(req.body),
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
          200: ORDER_RESPONSE_SCHEMA,
        },
      },
    },
    getOrders,
  );

  f.get(
    "/:order_id",
    {
      schema: {
        params: Type.Object({
          order_id: Type.String(),
        }),
        response: {
          ...ERROR_RESPONSE_SCHEMAS,
          200: ORDER_RESPONSE_SCHEMA,
        },
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
        response: {
          ...ERROR_RESPONSE_SCHEMAS,
          200: ORDER_RESPONSE_SCHEMA,
        },
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
        response: {
          ...ERROR_RESPONSE_SCHEMAS,
          200: Type.Number(),
        },
      },
    },
    (req) => deleteOrder(req.params.order_id),
  );
}
