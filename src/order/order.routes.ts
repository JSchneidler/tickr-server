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
  getOrdersQueryParams,
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
        querystring: getOrdersQueryParams,
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
          orderId: Type.String(),
        }),
        response: {
          ...errorResponseSchemas,
          200: orderResponse,
        },
      },
    },
    getOrderHandler,
  );

  f.patch(
    "/:orderId",
    {
      onRequest: [f.authenticate],
      schema: {
        params: Type.Object({
          orderId: Type.String(),
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
          orderId: Type.String(),
        }),
        response: {
          ...errorResponseSchemas,
        },
      },
    },
    deleteOrderHandler,
  );
}
