import env from "../env";

interface QuoteReply {
  c: number;
  d: number | null;
  dp: number | null;
  h: number;
  l: number;
  o: number;
  pc: number;
  t: number;
}

const API_BASE_URL = "https://finnhub.io/api/v1";

export async function quote(symbol: string) {
  const request = new Request(API_BASE_URL + `/quote?symbol=${symbol}`);
  request.headers.append("X-Finnhub-Token", env.FINNHUB_API_KEY);

  const response = await fetch(request);
  return response.json() as Promise<QuoteReply>;
}
