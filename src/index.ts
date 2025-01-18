import fastify from "fastify";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import fastifyCors from "@fastify/cors";
import fastifyWebsocket from "@fastify/websocket";

import tradeFeed from "./stocks/tradeFeed";
import tradeEngine from "./tradeEngine";
import jwtAuth from "./auth";
import api from "./api";

const start = async () => {
  try {
    await tradeFeed.start();
    await tradeEngine.start();

    const f = fastify({ logger: true }).withTypeProvider<TypeBoxTypeProvider>();
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
