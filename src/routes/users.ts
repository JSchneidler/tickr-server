import { Type } from "@sinclair/typebox";

import { FastifyTypeBox } from "fastify-typebox";

import {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} from "db/users";

import api_keys from "./api_keys";
import holdings from "./holdings";

export default function (f: FastifyTypeBox) {
  f.register(api_keys, { prefix: "/:user_id/api_keys" });
  f.register(holdings, { prefix: "/:user_id/holdings" });

  f.post(
    "/",
    {
      schema: {
        body: Type.Object({
          name: Type.String(),
          email: Type.String(),
        }),
      },
    },
    (req) => createUser({ ...req.body, password_digest: "" }),
  );

  f.get(
    "/",
    {
      schema: {
        querystring: Type.Object({
          limit: Type.Integer({ minimum: 1, maximum: 100 }),
        }),
      },
    },
    getUsers,
  );

  f.get(
    "/:user_id",
    {
      schema: {
        params: Type.Object({
          user_id: Type.Integer({ minimum: 0 }),
        }),
      },
    },
    (req) => getUser(req.params.user_id),
  );

  // f.get("/:user_id/orders", async (req) => {
  //   return await getOrdersForUser(req.params.user_id);
  // });
  // f.get(
  //   "/:user_id/orders",
  //   {
  //     schema: {
  //       querystring: Type.Object({
  //         limit: Type.Integer({ minimum: 1, maximum: 100 }),
  //       }),
  //     },
  //   },
  //   ordersForUser
  // );

  f.put(
    "/:user_id",
    {
      schema: {
        params: Type.Object({
          user_id: Type.Integer({ minimum: 0 }),
        }),
        body: Type.Object({}),
      },
    },
    (req) => updateUser(req.params.user_id, req.body),
  );

  f.delete(
    "/:user_id",
    {
      schema: {
        params: Type.Object({
          user_id: Type.Integer({ minimum: 0 }),
        }),
        body: Type.Object({}),
      },
    },
    (req) => deleteUser(req.params.user_id),
  );
}
