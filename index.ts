import Fastify from "fastify";

const fastify = Fastify({
  logger: true,
});

fastify.get("/", async (req, res) => {
  return "Hello, world!";
});

const start = async () => {
  try {
    const address = await fastify.listen({ port: 3000 });
    fastify.log.info(`Server listening on ${address}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
