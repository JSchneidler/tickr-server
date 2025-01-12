import { FastifyTypeBox } from "fastify-typebox";

import admin from "./admin";
import orders from "./orders";
import users from "./users";

export default function (f: FastifyTypeBox) {
  f.get("/", () => "Welcome to the API!");

  f.register(admin, { prefix: "/admin" });
  f.register(orders, { prefix: "/orders" });
  f.register(users, { prefix: "/users" });
}
