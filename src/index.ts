import fastify from "fastify";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import fastifyCors from "@fastify/cors";
import fastifyWebsocket from "@fastify/websocket";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";

import tradeFeed from "./apis/tradeFeed";
import tradeEngine from "./tradeEngine";
import jwtAuth from "./auth";
import api from "./api";

const start = async () => {
  const f = fastify({ logger: true }).withTypeProvider<TypeBoxTypeProvider>();
  try {
    await tradeFeed.start();
    await tradeEngine.start();

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

    await f.register(jwtAuth);

    await f.register(fastifyWebsocket);
    await f.register(fastifyCors, {
      origin: "http://localhost:5173", // TODO: Don't hardcode
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization", "debug"],
    });

    await f.register(api, { prefix: "/api" });

    await f.ready();

    const address = await f.listen({ port: 3000 });
    f.log.info(`Server listening on ${address}`);
  } catch (err) {
    f.log.error(err);
    process.exit(1);
  }
};

void start();
