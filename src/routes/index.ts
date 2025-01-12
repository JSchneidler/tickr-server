import { FastifyInstance } from "fastify";

export default function (fastify: FastifyInstance) {
  fastify.get("/", () => {
    return "Welcome to the API!";
  });
}
