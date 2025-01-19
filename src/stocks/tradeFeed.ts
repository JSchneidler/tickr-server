import WebSocket from "ws";

import env from "../env";
import { Prisma } from "@prisma/client";

interface Trade {
  c: number[] | undefined; // Trade conditions
  p: number; // Last price
  s: string; // Symbol
  t: string; // UNIX Timetamp (ms)
  v: string; // Volume
}

interface SocketMessage {
  data: unknown;
  type: "trade" | "";
}

interface TradesMessage extends SocketMessage {
  type: "trade";
  data: Trade[];
}

type TradeListener = (summary: TradesSummary) => void | Promise<void>;
export type UnSubFn = () => void;

export interface TradesSummary {
  high: Prisma.Decimal;
  low: Prisma.Decimal;
}

const FINNHUB_WEBSOCKET_URL = "wss://ws.finnhub.io";
const URL = `${FINNHUB_WEBSOCKET_URL}?token=${env.FINNHUB_API_KEY}`;

const PUBLISH_INTERVAL = 1000;

class TradeFeed {
  private subscriptions = new Map<string, TradeListener[]>();
  private ws = new WebSocket(URL, {});

  private tradesSummaries = new Map<string, TradesSummary>();

  async start() {
    setInterval(() => {
      void this.publish(); // TODO: Race condition? Should make sure publish finishes before publishing again
    }, PUBLISH_INTERVAL);

    const connectedPromise = new Promise<void>((resolve, reject) => {
      this.ws.on("open", () => {
        console.log("Connected to Finnhub WSS");
        resolve();
      });

      this.ws.on("message", (message: string) => {
        const response = JSON.parse(message) as SocketMessage;
        if (response.type == "trade") {
          const tradesMessage = response as TradesMessage;
          for (const trade of tradesMessage.data) {
            if (this.tradesSummaries.has(trade.s)) {
              const summary = this.tradesSummaries.get(trade.s);
              if (summary.low.greaterThan(trade.p))
                summary.low = new Prisma.Decimal(trade.p);
              else if (summary.high.lessThan(trade.p))
                summary.high = new Prisma.Decimal(trade.p);
            } else
              this.tradesSummaries.set(trade.s, {
                high: new Prisma.Decimal(trade.p),
                low: new Prisma.Decimal(trade.p),
              });
          }
        }
      });

      this.ws.on("error", (error) => {
        console.error(error);
        reject(error);
      });
    });

    return connectedPromise;
  }

  private async publish() {
    for (const [symbol, summary] of this.tradesSummaries)
      if (this.subscriptions.has(symbol)) {
        const listeners = this.subscriptions.get(symbol);
        for (const listener of listeners) await listener(summary);
      }

    this.tradesSummaries = new Map();
  }

  subscribe(symbol: string, listener: TradeListener): UnSubFn {
    if (this.subscriptions.has(symbol))
      this.subscriptions.get(symbol).push(listener);
    else {
      this.subscriptions.set(symbol, [listener]);
      this.ws.send(JSON.stringify({ type: "subscribe", symbol }));
      console.log(`Subscribed to ${symbol}`);
    }

    return () => {
      this.unsubscribe(symbol, listener);
    };
  }

  private unsubscribe(symbol: string, listener: TradeListener) {
    if (this.subscriptions.has(symbol)) {
      this.subscriptions.set(
        symbol,
        this.subscriptions.get(symbol).filter((l) => listener !== l),
      );

      if (this.subscriptions.get(symbol).length === 0) {
        this.ws.send(JSON.stringify({ type: "unsubscribe", symbol }));
        this.subscriptions.delete(symbol);
        console.log(`Unsubscribed from ${symbol}`);
      }
    }
  }
}

export default new TradeFeed();
