import env from "../env";

interface QuoteReply {
  c: number; // Current price
  d: number; // Change
  dp: number; // Percent change
  h: number; // High price of the day
  l: number; // Low price of the day
  o: number; // Open price of the day
  pc: number; // Previous close price
}

const API_BASE_URL = "https://finnhub.io/api/v1";

export async function quote(symbol: string) {
  const request = new Request(API_BASE_URL + `/quote?symbol=${symbol}`);
  request.headers.append("X-Finnhub-Token", env.FINNHUB_API_KEY);

  const response = await fetch(request);
  return response.json() as Promise<QuoteReply>;
}
