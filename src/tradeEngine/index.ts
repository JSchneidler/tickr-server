import db from "../db";
import tradeFeed, { TradesSummary, UnSubFn } from "../stocks/tradeFeed";
import { getUser } from "../user/user.service";
import {
  Order,
  OrderDirection,
  OrderType,
  Prisma,
  Symbol,
} from "@prisma/client";

interface Subscription {
  orders: Order[];
  unsubscribe: UnSubFn;
}

class TradeEngine {
  private orders = new Map<string, Subscription>();

  async start() {
    const orders = await db.order.findMany({
      where: { filled: false },
      include: { Symbol: true },
    });

    for (const order of orders) this.addOrder(order, order.Symbol);
  }

  addOrder(order: Order, symbol: Symbol) {
    if (this.orders.has(symbol.name)) {
      this.orders.get(symbol.name).orders.push(order);
    } else {
      this.orders.set(symbol.name, {
        orders: [order],
        unsubscribe: tradeFeed.subscribe(symbol.name, async (summary) => {
          await this.processOrders(symbol, summary);
        }),
      });
    }
    console.log(
      `Registered order ${order.direction}@${order.type} ${order.shares.toString()} of ${symbol.name}`,
    );
  }

  removeOrder(order: Order, symbol: Symbol) {
    const subscription = this.orders.get(symbol.name);
    subscription.orders = this.orders
      .get(symbol.name)
      ?.orders.filter((o) => o.id !== order.id);

    if (subscription.orders.length === 0) {
      subscription.unsubscribe();
      this.orders.delete(symbol.name);
    }
  }

  async processOrders(symbol: Symbol, summary: TradesSummary) {
    // console.log(
    //   `${this.orders.get(symbol).orders.length.toString()} ${symbol} orders queued`
    // );

    const orders = this.orders.get(symbol.name).orders;

    await Promise.all([
      this.processMarketOrders(
        orders.filter((order) => order.type === OrderType.MARKET),
        symbol,
        summary,
      ),
      this.processLimitOrders(
        orders.filter((order) => order.type === OrderType.LIMIT),
        symbol,
        summary,
      ),
      this.processStopOrders(
        orders.filter((order) => order.type === OrderType.STOP),
        symbol,
        summary,
      ),
      this.processTrailingStopOrders(
        orders.filter((order) => order.type === OrderType.TRAILING_STOP),
        symbol,
        summary,
      ),
    ]);
  }

  private async fillOrder(
    order: Order,
    symbol: Symbol,
    sharePrice: Prisma.Decimal,
    totalPrice: Prisma.Decimal,
  ) {
    this.removeOrder(order, symbol);
    await db.order.update({
      where: { id: order.id },
      data: { filled: true, sharePrice, totalPrice },
    });
    console.log(
      `Filled order ${order.id.toString()}: ${order.direction}@${order.type} ${order.shares.toString()} of ${symbol.name}(${sharePrice.toString()}). Total: ${totalPrice.toString()}`,
    );
  }

  private async fillBuyOrder(
    order: Order,
    symbol: Symbol,
    price: Prisma.Decimal,
  ) {
    const cost = order.shares.mul(price);
    const user = await getUser(order.userId);
    if (user.balance.lessThan(cost)) {
      // TODO: Alert user order cannot be filled and/or partially fill
      // console.log(
      //   `Order ${order.id.toString()} cannot be fulfilled, user balance not high enough.`
      // );
      // this.removeOrder(order);
      return;
    }

    await this.fillOrder(order, symbol, price, cost);

    const where: Prisma.HoldingWhereUniqueInput = {
      userId_symbolId: { userId: order.userId, symbolId: order.symbolId },
    };
    const holding = await db.holding.findUnique({
      where,
    });

    const shares = {
      shares: holding ? holding.shares.add(order.shares) : order.shares,
    };
    await db.holding.upsert({
      where,
      create: { ...shares, symbolId: symbol.id, userId: order.userId },
      update: shares,
    });

    await db.user.update({
      where: { id: order.userId },
      data: { balance: user.balance.sub(cost) },
    });
  }

  private async fillSellOrder(
    order: Order,
    symbol: Symbol,
    price: Prisma.Decimal,
  ) {
    const cost = order.shares.mul(price);

    const holding = await db.holding.findFirstOrThrow({
      where: { symbolId: order.symbolId },
    });

    await this.fillOrder(order, symbol, price, cost);

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

  async processMarketOrders(
    orders: Order[],
    symbol: Symbol,
    summary: TradesSummary,
  ) {
    if (orders.length === 0) return;

    const fillPrice = summary.high.add(summary.low).div(2);

    for (const order of orders) {
      switch (order.direction) {
        case OrderDirection.BUY:
          await this.fillBuyOrder(order, symbol, fillPrice);
          break;
        case OrderDirection.SELL:
          await this.fillSellOrder(order, symbol, fillPrice);
          break;
      }
    }
  }
  async processLimitOrders(
    orders: Order[],
    symbol: Symbol,
    summary: TradesSummary,
  ) {
    if (orders.length === 0) return;
  }
  async processStopOrders(
    orders: Order[],
    symbol: Symbol,
    summary: TradesSummary,
  ) {
    if (orders.length === 0) return;
  }
  async processTrailingStopOrders(
    orders: Order[],
    symbol: Symbol,
    summary: TradesSummary,
  ) {
    if (orders.length === 0) return;
  }
}

export default new TradeEngine();
