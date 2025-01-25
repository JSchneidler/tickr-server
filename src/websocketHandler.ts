import tradeEngine from "./tradeEngine";
import tradeFeed from "./apis/tradeFeed";
import { WebsocketHandler } from "@fastify/websocket";

enum WebSocketMessageType {
  ORDER_FILLED = "ORDER_FILLED",
  WATCH = "WATCH",
}

const websocketHandler: WebsocketHandler = (socket, req) => {
  console.log(`User connected: ${req.user.name}(${req.user.id})`);

  setInterval(() => {
    socket.send(
      JSON.stringify({
        type: WebSocketMessageType.WATCH,
        payload: tradeFeed.getLastPrices(),
      }),
    );
  }, 1000);

  tradeEngine.addLiveUser(req.user.id, (order) => {
    socket.send(
      JSON.stringify({
        type: WebSocketMessageType.ORDER_FILLED,
        payload: order,
      }),
    );
  });

  socket.on("error", (error) => {
    console.error(error);
  });

  socket.on("close", () => {
    console.log("Client disconnected");
    tradeEngine.removeLiveUser(req.user.id);
  });
};

export default websocketHandler;
