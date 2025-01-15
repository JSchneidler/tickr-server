import { FastifyTypeBox } from "../fastify-typebox";
import { quote } from "../stocks/api";
import { latestPrices } from "../stocks/live";

import admin from "./admin";
import orders from "./orders";
import users from "./users";

export default function (f: FastifyTypeBox) {
  f.get("/", () => "Welcome to the API!");

  f.get("/ws", { websocket: true }, (connection) => {
    console.log("Client connected");

    setInterval(() => {
      connection.send(
        JSON.stringify({
          type: "prices",
          prices: latestPrices,
        }),
      );
    }, 1000);

    // connection.on("message", (message) => {
    //   console.log(message.toString());
    // });

    connection.on("error", (error) => {
      console.error(error);
    });

    connection.on("close", () => {
      console.log("Client disconnected");
    });
  });

  f.get("/quote", async () => await quote("AAPL"));

  f.register(admin, { prefix: "/admin" });
  f.register(orders, { prefix: "/orders" });
  f.register(users, { prefix: "/users" });
}
