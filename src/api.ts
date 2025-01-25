import { FastifyInstance } from "fastify";

import authRoutes from "./auth/auth.routes";
import meRoutes from "./user/me.routes";
import userRoutes from "./user/user.routes";
// import adminRoutes from "./admin/admin.routes";
import coinRoutes from "./coin/coin.routes";
import tokenRoutes from "./token/token.routes";
import holdingRoutes from "./holding/holding.routes";
import orderRoutes from "./order/order.routes";
import websocketHandler from "./websocketHandler";

export default async function (f: FastifyInstance) {
  f.get("/ws", { websocket: true }, websocketHandler);

  await f.register(authRoutes, { prefix: "/auth" });
  await f.register(meRoutes, { prefix: "/me" });
  await f.register(userRoutes, { prefix: "/users" });
  // await f.register(adminRoutes, { prefix: "/admin" });
  await f.register(coinRoutes, { prefix: "/coins" });
  await f.register(tokenRoutes, { prefix: "/tokens" });
  await f.register(holdingRoutes, { prefix: "/holdings" });
  await f.register(orderRoutes, { prefix: "/orders" });
}
