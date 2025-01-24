import { FastifyInstance } from "fastify";
import { Type } from "@sinclair/typebox";

import { errorResponseSchemas } from "../error_responses.schema";
import {
  getOrderParams,
  getOrdersQueryParams,
  orderResponse,
  ordersResponse,
  updateOrderRequestBody,
} from "../order/order.schema";
import {
  deleteUserOrderHandler,
  getUserOrderHandler,
  getUserOrdersHandler,
  updateUserOrderHandler,
} from "./user_order.controller";

export default function (f: FastifyInstance) {
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
    getUserOrdersHandler,
  );

  f.get(
    "/:orderId",
    {
      onRequest: [f.authenticate],
      schema: {
        params: getOrderParams,
        response: {
          ...errorResponseSchemas,
          200: orderResponse,
        },
      },
    },
    getUserOrderHandler,
  );

  f.patch(
    "/:orderId",
    {
      onRequest: [f.authenticate],
      schema: {
        params: getOrderParams,
        body: updateOrderRequestBody,
        response: {
          ...errorResponseSchemas,
          200: orderResponse,
        },
      },
    },
    updateUserOrderHandler,
  );

  f.delete(
    "/:orderId",
    {
      onRequest: [f.authenticate],
      schema: {
        params: getOrderParams,
        response: {
          ...errorResponseSchemas,
        },
      },
    },
    deleteUserOrderHandler,
  );
}
