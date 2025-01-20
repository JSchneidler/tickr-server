import "../env";
import db from "../db";
import { getCoinData } from "../apis/coingecko_api";

async function fetchCoins() {
  const coinData = await getCoinData();

  await db.coin.createMany({
    data: coinData,
  });

  console.log(`Registered ${coinData.length.toString()} coins`);
}

void fetchCoins();
