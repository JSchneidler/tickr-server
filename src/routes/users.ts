import { Type } from "@sinclair/typebox";

import { FastifyTypeBox } from "../fastify-typebox";
import { ERROR_RESPONSE_SCHEMAS } from "./errors";

import {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} from "../db/users";

import api_keys from "./api_keys";
import holdings from "./holdings";

export const USER_RESPONSE_SCHEMA = Type.Object({
  id: Type.Number(),

  email: Type.String(),
  name: Type.String(),

  balance: Type.Number(),
  role: Type.String(),

  createdAt: Type.String(),
  updatedAt: Type.String(),
});

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
        response: {
          ...ERROR_RESPONSE_SCHEMAS,
          201: USER_RESPONSE_SCHEMA,
        },
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
        response: {
          ...ERROR_RESPONSE_SCHEMAS,
          200: Type.Array(USER_RESPONSE_SCHEMA),
        },
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
        response: {
          ...ERROR_RESPONSE_SCHEMAS,
          201: USER_RESPONSE_SCHEMA,
        },
      },
    },
    (req) => getUser(req.params.user_id),
  );

  f.put(
    "/:user_id",
    {
      schema: {
        params: Type.Object({
          user_id: Type.Integer({ minimum: 0 }),
        }),
        body: Type.Object({}),
        response: {
          ...ERROR_RESPONSE_SCHEMAS,
          201: USER_RESPONSE_SCHEMA,
        },
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
        response: {
          ...ERROR_RESPONSE_SCHEMAS,
          200: Type.Number(),
        },
      },
    },
    (req) => deleteUser(req.params.user_id),
  );
}
