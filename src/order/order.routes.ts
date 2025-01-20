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
  createOrderRequestBody,
  orderResponse,
  ordersResponse,
} from "./order.schema";

export default function (f: FastifyInstance) {
  f.post(
    "/",
    {
      onRequest: [f.authenticate],
      schema: {
        body: createOrderRequestBody,
        response: {
          ...errorResponseSchemas,
          201: orderResponse,
        },
      },
    },
    createOrderHandler,
  );

  f.get(
    "/",
    {
      onRequest: [f.authenticate],
      schema: {
        response: {
          ...errorResponseSchemas,
          200: ordersResponse,
        },
      },
    },
    getOrdersHandler,
  );

  f.get(
    "/:orderId",
    {
      onRequest: [f.authenticate],
      schema: {
        params: Type.Object({
          orderId: Type.Number(),
        }),
        response: {
          ...errorResponseSchemas,
          200: orderResponse,
        },
      },
    },
    getOrderHandler,
  );

  f.put(
    "/:orderId",
    {
      onRequest: [f.authenticate],
      schema: {
        params: Type.Object({
          orderId: Type.Number(),
        }),
        body: Type.Object({}),
        response: {
          ...errorResponseSchemas,
          200: orderResponse,
        },
      },
    },
    updateOrderHandler,
  );

  f.delete(
    "/:orderId",
    {
      onRequest: [f.authenticate],
      schema: {
        params: Type.Object({
          orderId: Type.Number(),
        }),
        response: {
          ...errorResponseSchemas,
          200: Type.Number(),
        },
      },
    },
    deleteOrderHandler,
  );
}
