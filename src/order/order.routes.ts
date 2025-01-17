import { FastifyInstance } from "fastify";
import { Type } from "@sinclair/typebox";

import { errorResponseSchemas } from "../error_responses.schema";

import {
  createOrderHandler,
  getOrdersHandler,
  getOrderHandler,
  updateOrderHandler,
  deleteOrderHandler,
} from "./order.controller";
import {
  createOrderSchema,
  ordersResponseSchema,
  orderResponseSchema,
} from "./order.schema";

export default function (f: FastifyInstance) {
  f.post(
    "/",
    {
      onRequest: [f.authenticate],
      schema: {
        body: createOrderSchema,
        response: {
          ...errorResponseSchemas,
          201: orderResponseSchema,
        },
      },
    },
    createOrderHandler,
  );

  f.get(
    "/",
    {
      schema: {
        response: {
          ...errorResponseSchemas,
          200: ordersResponseSchema,
        },
      },
    },
    getOrdersHandler,
  );

  f.get(
    "/:order_id",
    {
      schema: {
        params: Type.Object({
          order_id: Type.Number(),
        }),
        response: {
          ...errorResponseSchemas,
          200: orderResponseSchema,
        },
      },
    },
    getOrderHandler,
  );

  f.put(
    "/:order_id",
    {
      onRequest: [f.authenticate],
      schema: {
        params: Type.Object({
          order_id: Type.Number(),
        }),
        body: Type.Object({}),
        response: {
          ...errorResponseSchemas,
          200: orderResponseSchema,
        },
      },
    },
    updateOrderHandler,
  );

  f.delete(
    "/:order_id",
    {
      onRequest: [f.authenticate],
      schema: {
        params: Type.Object({
          order_id: Type.Number(),
        }),
        response: {
          ...errorResponseSchemas,
          200: orderResponseSchema,
        },
      },
    },
    deleteOrderHandler,
  );
}
