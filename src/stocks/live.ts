import WebSocket from "ws";

import env from "../env";
import { quote } from "./api";

const FINNHUB_WEBSOCKET_URL = "wss://ws.finnhub.io";

const SUBSCRIBED_SYMBOLS = [
  "AAPL",
  "GOOG",
  "GOOGL",
  "TSLA",
  "TSM",
  "NVDA",
  "INTC",
  "AMD",
  "AAL",
  "UAL",
  "AMZN",
  "MSFT",
  "META",
  "BINANCE:BTCUSDT",
];

interface Price {
  symbol: string;
  price: number;
  open_price: number;
  change: number;
  change_percent: number;
}

type Prices = Record<string, Price>;

interface Trade {
  c: number[] | undefined; // Trade conditions
  p: number; // Last price
  s: string; // Symbol
  t: string; // UNIX Timetamp (ms)
  v: string; // Volume
}

interface Response {
  data: Trade[];
  type: "trade" | "";
}

export const latestPrices: Prices = {};

export async function init() {
  // TODO: Switch to Promise.all and eventually link to cache/DB
  for (const symbol of SUBSCRIBED_SYMBOLS) {
    const symbolInfo = await quote(symbol);
    latestPrices[symbol] = {
      symbol,
      price: symbolInfo.c,
      open_price: symbolInfo.o,
      change: symbolInfo.d,
      change_percent: symbolInfo.dp,
    };
  }

  const URL = `${FINNHUB_WEBSOCKET_URL}?token=${env.FINNHUB_API_KEY}`;
  const ws = new WebSocket(URL, {});

  ws.on("open", () => {
    console.log("Connected to Finnhub WSS");

    for (const symbol of SUBSCRIBED_SYMBOLS) {
      ws.send(JSON.stringify({ type: "subscribe", symbol }));
    }
  });

  ws.on("message", (message: string) => {
    const response = JSON.parse(message) as Response;
    if (response.type == "trade") {
      for (const trade of response.data) {
        const symbol = trade.s;
        const price = trade.p;
        let change = 0;
        let change_percent = 0;
        let open_price = 0;

        const latest = latestPrices[symbol];
        if (latest) {
          open_price = latest.open_price;
          change = price - latest.open_price;
          change_percent = (change / latest.open_price) * 100;
        }

        latestPrices[symbol] = {
          symbol,
          price,
          change,
          change_percent,
          open_price,
        };
      }
    }
  });

  ws.on("error", console.error);
}
