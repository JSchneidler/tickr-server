import Fastify from "fastify";

import routes from "./routes";

const fastify = Fastify({
  logger: true,
});

fastify.register(routes);

const start = async () => {
  try {
    const address = await fastify.listen({ port: 3000 });
    fastify.log.info(`Server listening on ${address}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

void start();
