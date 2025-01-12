import { FastifyInstance } from "fastify";

export default async function (fastify: FastifyInstance, opts) {
  fastify.get("/", async (req, res) => {
    return "Welcome to the API!";
  });
}
