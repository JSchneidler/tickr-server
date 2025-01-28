import { FastifyInstance } from "fastify";

import { errorResponseSchemas } from "../error_responses.schema";
import {
  getOrderParams,
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
      onRequest: [f.admin],
      schema: {
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
      onRequest: [f.admin],
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
      onRequest: [f.admin],
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
      onRequest: [f.admin],
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
