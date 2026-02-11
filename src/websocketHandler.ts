import tradeEngine from "./tradeEngine";
import tradeFeed from "./apis/tradeFeed";
import { WebsocketHandler } from "@fastify/websocket";

enum WebSocketMessageType {
  ORDER_FILLED = "ORDER_FILLED",
  WATCH = "WATCH",
}

const websocketHandler: WebsocketHandler = (socket, req) => {
  if (req.user) {
    console.log(`User connected: ${req.user.name}(${req.user.id.toString()})`);

    tradeEngine.addLiveUser(req.user.id, (order) => {
      socket.send(
        JSON.stringify({
          type: WebSocketMessageType.ORDER_FILLED,
          payload: order,
        }),
      );
    });
  } else console.log(`Guest connected: ${req.ip}`);

  const interval = setInterval(() => {
    socket.send(
      JSON.stringify({
        type: WebSocketMessageType.WATCH,
        payload: tradeFeed.getLastPrices(),
      }),
    );
  }, 1000);

  socket.on("error", (error) => {
    console.error(error);
  });

  socket.on("close", () => {
    if (req.user) {
      console.log(
        `User disconnected: ${req.user.name}(${req.user.id.toString()})`,
      );
      tradeEngine.removeLiveUser(req.user.id);
    } else console.log(`Guest disconnected: ${req.ip}`);

    clearInterval(interval);
  });
};

export default websocketHandler;
