import env from "../env";

interface Quote {
  c: number; // Current price
  d: number; // Change
  dp: number; // Percent change
  h: number; // High price of the day
  l: number; // Low price of the day
  o: number; // Open price of the day
  pc: number; // Previous close price
}

type CryptoExchangesResponse = string[];

interface CryptoSymbol {
  description: string;
  displaySymbol: string;
  symbol: string;
}

const API_BASE_URL = "https://finnhub.io/api/v1";

// TODO: Create client?
function baseRequest(url: string) {
  const request = new Request(url);
  request.headers.append("X-Finnhub-Token", env.FINNHUB_API_KEY);
  return request;
}

export async function getQuote(symbol: string) {
  const request = baseRequest(API_BASE_URL + `/quote?symbol=${symbol}`);

  const response = await fetch(request);
  return (await response.json()) as Quote;
}

export async function getCryptoExchanges() {
  const request = baseRequest(API_BASE_URL + "/crypto/exchange");

  const response = await fetch(request);
  return (await response.json()) as CryptoExchangesResponse;
}

export async function getCryptoSymbols(exchange: string) {
  const request = baseRequest(
    API_BASE_URL + `/crypto/symbol?exchange=${exchange}`,
  );

  const response = await fetch(request);
  return (await response.json()) as CryptoSymbol[];
}
