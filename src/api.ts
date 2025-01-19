import { FastifyInstance } from "fastify";

import authRoutes from "./auth/auth.routes";
// import adminRoutes from "./admin/admin.routes";
import userRoutes from "./user/user.routes";
import symbolRoutes from "./symbol/symbol.routes";

import { getCompanyInfo } from "./stocks/polygon_api";

export default async function (f: FastifyInstance) {
  f.get("/ws", { websocket: true }, (connection) => {
    console.log("Client connected");

    // setInterval(() => {
    //   connection.send(
    //     JSON.stringify({
    //       type: "prices",
    //       prices: latestPrices,
    //     })
    //   );
    // }, 1000);

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

  f.get("/", async () => await getCompanyInfo("NVDA"));

  await f.register(authRoutes, { prefix: "/auth" });
  // await f.register(adminRoutes, { prefix: "/admin" });
  await f.register(symbolRoutes, { prefix: "/symbol" });
  await f.register(userRoutes, { prefix: "/user" });
}
