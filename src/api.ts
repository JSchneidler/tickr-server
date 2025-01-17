import { FastifyInstance } from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";

import authRoutes from "./auth/auth.routes";
// import adminRoutes from "./admin/admin.routes";
import userRoutes from "./user/user.routes";

import { getQuote } from "./stocks/finnhub_api";
import { latestPrices } from "./stocks/finnhub_live";
import symbolRoutes from "./symbol/symbol.routes";

export default async function (f: FastifyInstance) {
  await f.register(fastifySwagger, {
    openapi: {
      openapi: "3.1.0",
      info: {
        title: "Tickr API",
        description: "Tickr API",
        version: "0.0.0",
      },
      components: {
        securitySchemes: {
          apiKey: {
            // TODO: Update to match JWT structure
            type: "apiKey",
            name: "apiKey",
            in: "header",
          },
        },
      },
    },
  });

  await f.register(fastifySwaggerUi, {
    routePrefix: "/docs",
    uiConfig: {
      docExpansion: "full",
      deepLinking: false,
    },
    staticCSP: true,
  });

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

  f.get("/quote", async () => await getQuote("AAPL"));

  await f.register(authRoutes, { prefix: "/auth" });
  // await f.register(adminRoutes, { prefix: "/admin" });
  await f.register(symbolRoutes, { prefix: "/symbol" });
  await f.register(userRoutes, { prefix: "/user" });
}
