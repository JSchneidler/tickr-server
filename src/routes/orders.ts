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
  // @ts-expect-error Date is assignable to type string
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
    (req) => createOrder({ ...req.body, User: {} }),
  );

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
          200: Type.Array(ORDER_RESPONSE_SCHEMA),
        },
      },
    },
    getOrders,
  );

  // @ts-expect-error Decimal is assignable to type number
  f.get(
    "/:order_id",
    {
      schema: {
        params: Type.Object({
          order_id: Type.Number(),
        }),
        response: {
          ...ERROR_RESPONSE_SCHEMAS,
          200: ORDER_RESPONSE_SCHEMA,
        },
      },
    },
    (req) => getOrder(req.params.order_id),
  );

  // @ts-expect-error Decimal is assignable to type number
  f.put(
    "/:order_id",
    {
      schema: {
        params: Type.Object({
          order_id: Type.Number(),
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
          order_id: Type.Number(),
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
