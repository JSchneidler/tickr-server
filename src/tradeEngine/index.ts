import db from "../db";
import tradeFeed, { TradesSummary, UnSubFn } from "../apis/tradeFeed";
import { getUser } from "../user/user.service";
import { Order, OrderDirection, OrderType, Prisma, Coin } from "@prisma/client";

interface Subscription {
  orders: Order[];
  unsubscribe: UnSubFn;
}

class TradeEngine {
  private orders = new Map<string, Subscription>();

  async start() {
    const orders = await db.order.findMany({
      where: { filled: false },
      include: { Coin: true },
    });

    for (const order of orders) this.addOrder(order, order.Coin);
  }

  addOrder(order: Order, coin: Coin) {
    if (this.orders.has(coin.name)) {
      this.orders.get(coin.name).orders.push(order);
    } else {
      this.orders.set(coin.name, {
        orders: [order],
        unsubscribe: tradeFeed.subscribe(coin.name, async (summary) => {
          await this.processOrders(coin, summary);
        }),
      });
    }
    console.log(
      `Registered order ${order.direction}@${order.type} ${order.shares.toString()} of ${coin.name}`,
    );
  }

  removeOrder(order: Order, coin: Coin) {
    const subscription = this.orders.get(coin.name);
    subscription.orders = this.orders
      .get(coin.name)
      ?.orders.filter((o) => o.id !== order.id);

    if (subscription.orders.length === 0) {
      subscription.unsubscribe();
      this.orders.delete(coin.name);
    }
  }

  async processOrders(coin: Coin, summary: TradesSummary) {
    // console.log(
    //   `${this.orders.get(coin).orders.length.toString()} ${coin} orders queued`
    // );

    const orders = this.orders.get(coin.name).orders;

    await Promise.all([
      this.processMarketOrders(
        orders.filter((order) => order.type === OrderType.MARKET),
        coin,
        summary,
      ),
      this.processLimitOrders(
        orders.filter((order) => order.type === OrderType.LIMIT),
        coin,
        summary,
      ),
      this.processStopOrders(
        orders.filter((order) => order.type === OrderType.STOP),
        coin,
        summary,
      ),
      this.processTrailingStopOrders(
        orders.filter((order) => order.type === OrderType.TRAILING_STOP),
        coin,
        summary,
      ),
    ]);
  }

  private async fillOrder(
    order: Order,
    coin: Coin,
    sharePrice: Prisma.Decimal,
    totalPrice: Prisma.Decimal,
  ) {
    this.removeOrder(order, coin);
    await db.order.update({
      where: { id: order.id },
      data: { filled: true, sharePrice, totalPrice },
    });
    console.log(
      `Filled order ${order.id.toString()}: ${order.direction}@${order.type} ${order.shares.toString()} of ${coin.name}(${sharePrice.toString()}). Total: ${totalPrice.toString()}`,
    );
  }

  private async fillBuyOrder(order: Order, coin: Coin, price: Prisma.Decimal) {
    const cost = order.shares.mul(price).toDecimalPlaces(2);
    const user = await getUser(order.userId);
    if (user.balance.lessThan(cost)) {
      // TODO: Alert user order cannot be filled and/or partially fill
      // console.log(
      //   `Order ${order.id.toString()} cannot be fulfilled, user balance not high enough.`
      // );
      // this.removeOrder(order);
      return;
    }

    await this.fillOrder(order, coin, price, cost);

    const where: Prisma.HoldingWhereUniqueInput = {
      userId_coinId: { userId: order.userId, coinId: order.coinId },
    };
    const holding = await db.holding.findUnique({
      where,
    });

    const shares = {
      shares: holding ? holding.shares.add(order.shares) : order.shares,
    };
    await db.holding.upsert({
      where,
      create: { ...shares, coinId: coin.id, userId: order.userId },
      update: shares,
    });

    await db.user.update({
      where: { id: order.userId },
      data: { balance: user.balance.sub(cost).toDecimalPlaces(2) },
    });
  }

  private async fillSellOrder(order: Order, coin: Coin, price: Prisma.Decimal) {
    const cost = order.shares.mul(price).toDecimalPlaces(2);

    const holding = await db.holding.findFirstOrThrow({
      where: { coinId: order.coinId },
    });

    await this.fillOrder(order, coin, price, cost);

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
    coin: Coin,
    summary: TradesSummary,
  ) {
    if (orders.length === 0) return;

    const fillPrice = summary.high.add(summary.low).div(2);

    for (const order of orders) {
      switch (order.direction) {
        case OrderDirection.BUY:
          await this.fillBuyOrder(order, coin, fillPrice);
          break;
        case OrderDirection.SELL:
          await this.fillSellOrder(order, coin, fillPrice);
          break;
      }
    }
  }
  async processLimitOrders(
    orders: Order[],
    coin: Coin,
    summary: TradesSummary,
  ) {
    if (orders.length === 0) return;
  }
  async processStopOrders(orders: Order[], coin: Coin, summary: TradesSummary) {
    if (orders.length === 0) return;
  }
  async processTrailingStopOrders(
    orders: Order[],
    coin: Coin,
    summary: TradesSummary,
  ) {
    if (orders.length === 0) return;
  }
}

export default new TradeEngine();
