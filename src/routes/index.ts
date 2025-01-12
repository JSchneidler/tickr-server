import { FastifyInstance } from "fastify";
import { quote } from "stocks";

interface SymbolParams {
  symbol: string;
}

export default function (fastify: FastifyInstance) {
  fastify.get<{ Params: SymbolParams }>("/symbol/:symbol", async (req) => {
    const data = await quote(req.params.symbol);
    return data;
  });
}
