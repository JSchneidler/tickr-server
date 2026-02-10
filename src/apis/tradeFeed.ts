import WebSocket from "ws";
import { Prisma } from "@prisma/client";

import env from "../env";
import { getCoins } from "../coin/coin.service";
import { CoinResponse } from "../coin/coin.schema";

interface Trade {
  c: number[] | undefined; // Trade conditions
  p: number; // Last price
  s: string; // Coin
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
  last: Prisma.Decimal;
  high: Prisma.Decimal;
  low: Prisma.Decimal;
}

interface LivePrice {
  coinId: number;
  price: string;
}

const FINNHUB_WEBSOCKET_URL = "wss://ws.finnhub.io";
const URL = `${FINNHUB_WEBSOCKET_URL}?token=${env.FINNHUB_API_KEY}`;

const PUBLISH_INTERVAL = 1000; // Remove interval, publish immediately somehow

class TradeFeed {
  private ws = new WebSocket(URL, {});

  private coins: CoinResponse[] = [];
  private subscriptions = new Map<string, TradeListener[]>();
  private tradesSummaries = new Map<string, TradesSummary>();

  async start() {
    this.coins = await getCoins();

    const connectedPromise = new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(
          new Error("Connection to Finnhub WSS timed out after 10 seconds")
        );
      }, 10000);

      this.ws.on("open", () => {
        clearTimeout(timeout);
        console.log("Connected to Finnhub WSS");
        this.startSubscriptions();
        resolve();
      });

      this.ws.on("message", (message: string) => {
        const response = JSON.parse(message) as SocketMessage;
        if (response.type == "trade") {
          const tradesMessage = response as TradesMessage;
          for (const trade of tradesMessage.data) {
            const coin = fromSubscriptionFormat(trade.s);
            const price = new Prisma.Decimal(trade.p);
            if (this.tradesSummaries.has(coin)) {
              const summary = this.tradesSummaries.get(coin)!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
              summary.last = price;
              if (summary.low.greaterThan(trade.p)) summary.low = price;
              else if (summary.high.lessThan(trade.p)) summary.high = price;
            } else
              this.tradesSummaries.set(coin, {
                last: price,
                high: price,
                low: price,
              });
          }
        }
      });

      this.ws.on("error", (error) => {
        clearTimeout(timeout);
        console.error(error);
        reject(error);
      });
    });

    setInterval(() => {
      void this.publish(); // TODO: Race condition? Should make sure publish finishes before publishing again
    }, PUBLISH_INTERVAL);

    return connectedPromise;
  }

  getLastPrices(): LivePrice[] {
    const last = [];
    for (const coin of this.coins)
      if (this.tradesSummaries.has(coin.name))
        last.push({
          coinId: coin.id,
          price: this.tradesSummaries.get(coin.name)!.last.toString(), // eslint-disable-line @typescript-eslint/no-non-null-assertion
        });

    return last;
  }

  private startSubscriptions() {
    for (const coin of this.coins)
      this.ws.send(
        JSON.stringify({
          type: "subscribe",
          symbol: toSubscriptionFormat(coin.name),
        })
      );
  }

  private async publish() {
    for (const [coin, summary] of this.tradesSummaries)
      if (this.subscriptions.has(coin)) {
        const listeners = this.subscriptions.get(coin)!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
        for (const listener of listeners) await listener(summary);
      }

    this.tradesSummaries.forEach((summary) => {
      summary.high = summary.last;
      summary.low = summary.last;
    });
  }

  subscribe(coin: string, listener: TradeListener): UnSubFn {
    if (this.subscriptions.has(coin))
      this.subscriptions.get(coin)!.push(listener); // eslint-disable-line @typescript-eslint/no-non-null-assertion
    else {
      this.subscriptions.set(coin, [listener]);
      // this.ws.send(
      //   JSON.stringify({
      //     type: "subscribe",
      //     symbol: toSubscriptionFormat(coin),
      //   }),
      // );
      // console.log(`Subscribed to ${coin}`);
    }

    return () => {
      this.unsubscribe(coin, listener);
    };
  }

  private unsubscribe(coin: string, listener: TradeListener) {
    if (this.subscriptions.has(coin)) {
      const listeners = this.subscriptions.get(coin)!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
      this.subscriptions.set(
        coin,
        listeners.filter((l) => listener !== l)
      );

      if (listeners.length === 0) {
        // this.ws.send(
        //   JSON.stringify({
        //     type: "unsubscribe",
        //     symbol: toSubscriptionFormat(coin),
        //   }),
        // );
        this.subscriptions.delete(coin);
        // console.log(`Unsubscribed from ${coin}`);
      }
    }
  }
}

const PREFIX = "BINANCE:";
const SUFFIX = "USDT";

function toSubscriptionFormat(coinName: string) {
  return `BINANCE:${coinName}USDT`;
}

function fromSubscriptionFormat(symbol: string) {
  return symbol.slice(PREFIX.length, SUFFIX.length * -1);
}

export default new TradeFeed();
