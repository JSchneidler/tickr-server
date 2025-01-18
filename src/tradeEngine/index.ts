import { OrderResponse } from "../order/order.schema";

import db from "../db";
import tradeFeed, { TradesSummary, UnSubFn } from "../stocks/tradeFeed";
import { getUser } from "../user/user.service";
import { OrderDirection, OrderType } from "@prisma/client";

interface Subscription {
  orders: OrderResponse[];
  unsubscribe: UnSubFn;
}

class TradeEngine {
  private orders = new Map<string, Subscription>();

  async start() {
    const orders = await db.order.findMany({ where: { filled: false } });

    // @ts-expect-error: Date is assignable to string
    for (const order of orders) this.addOrder(order);
  }

  addOrder(order: OrderResponse) {
    const symbol = order.symbol;
    if (this.orders.has(symbol)) {
      this.orders.get(symbol).orders.push(order);
    } else {
      this.orders.set(symbol, {
        orders: [order],
        unsubscribe: tradeFeed.subscribe(symbol, async (summary) => {
          await this.processOrders(symbol, summary);
        }),
      });
    }
    console.log(
      `Registered order ${order.direction}@${order.type} ${order.shares.toString()} of ${order.symbol}`,
    );
  }

  removeOrder(order: OrderResponse) {
    const subscription = this.orders.get(order.symbol);
    subscription.orders = this.orders
      .get(order.symbol)
      ?.orders.filter((o) => o.id !== order.id);

    if (subscription.orders.length === 0) {
      subscription.unsubscribe();
      this.orders.delete(order.symbol);
    }
  }

  async processOrders(symbol: string, summary: TradesSummary) {
    // console.log(
    //   `${this.orders.get(symbol).orders.length.toString()} ${symbol} orders queued`
    // );

    const orders = this.orders.get(symbol).orders;

    await Promise.all([
      this.processMarketOrders(
        orders.filter((order) => order.type === OrderType.MARKET),
        summary,
      ),
      this.processLimitOrders(
        orders.filter((order) => order.type === OrderType.LIMIT),
        summary,
      ),
      this.processStopOrders(
        orders.filter((order) => order.type === OrderType.STOP),
        summary,
      ),
      this.processTrailingStopOrders(
        orders.filter((order) => order.type === OrderType.TRAILING_STOP),
        summary,
      ),
    ]);
  }

  private async fillOrder(
    order: OrderResponse,
    sharePrice: number,
    totalPrice: number,
  ) {
    this.removeOrder(order);
    await db.order.update({
      where: { id: order.id },
      data: { filled: true, sharePrice, totalPrice },
    });
    console.log(
      `Filled order ${order.id.toString()}: ${order.direction}@${order.type} ${order.shares.toString()} of ${order.symbol}(${sharePrice.toString()}). Total: ${totalPrice.toString()}`,
    );
  }

  private async fillBuyOrder(order: OrderResponse, price: number) {
    const cost = order.shares * price;
    const user = await getUser(order.userId);
    if (user.balance.lessThan(cost)) {
      // TODO: Alert user order cannot be filled and/or partially fill
      // console.log(
      //   `Order ${order.id.toString()} cannot be fulfilled, user balance not high enough.`
      // );
      // this.removeOrder(order);
      return;
    }

    await this.fillOrder(order, price, cost);

    const where = {
      userId_symbol: { userId: order.userId, symbol: order.symbol },
    };
    const holding = await db.holding.findUnique({
      where,
    });

    const shares = {
      shares: holding ? holding.shares.add(order.shares) : order.shares,
    };
    await db.holding.upsert({
      where,
      create: { ...shares, symbol: order.symbol, userId: order.userId },
      update: shares,
    });

    await db.user.update({
      where: { id: order.userId },
      data: { balance: user.balance.sub(cost) },
    });
  }

  private async fillSellOrder(order: OrderResponse, price: number) {
    const cost = order.shares * price;

    const holding = await db.holding.findFirstOrThrow({
      where: { symbol: order.symbol },
    });

    await this.fillOrder(order, price, cost);

    if (holding.shares.equals(order.shares))
      await db.holding.delete({ where: { id: holding.id } });
    else
      await db.holding.update({
        where: { id: holding.id },
        data: { shares: holding.shares.sub(order.shares) },
      });

    const user = await getUser(order.userId);
    await db.user.update({
      where: { id: order.userId },
      data: { balance: user.balance.add(cost) },
    });
  }

  async processMarketOrders(orders: OrderResponse[], summary: TradesSummary) {
    if (orders.length === 0) return;

    const fillPrice = (summary.high + summary.low) / 2;

    for (const order of orders) {
      switch (order.direction) {
        case OrderDirection.BUY:
          await this.fillBuyOrder(order, fillPrice);
          break;
        case OrderDirection.SELL:
          await this.fillSellOrder(order, fillPrice);
          break;
      }
    }
  }
  async processLimitOrders(orders: OrderResponse[], summary: TradesSummary) {
    if (orders.length === 0) return;
  }
  async processStopOrders(orders: OrderResponse[], summary: TradesSummary) {
    if (orders.length === 0) return;
  }
  async processTrailingStopOrders(
    orders: OrderResponse[],
    summary: TradesSummary,
  ) {
    if (orders.length === 0) return;
  }
}

export default new TradeEngine();
