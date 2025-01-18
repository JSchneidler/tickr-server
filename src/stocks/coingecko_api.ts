import env from "../env";

const API_BASE_URL = "https://api.coingecko.com/api/v3/";

// TODO: Create client?
function baseRequest(url: string) {
  const request = new Request(url);
  request.headers.append("x-cg-demo-api-key", "${env.COINGECKO_API_KEY}");
  return request;
}

// export async function getCompanyInfo(symbol: string) {
//   const request = baseRequest(API_BASE_URL + `/v3/reference/tickers/${symbol}`);

//   const response = await fetch(request);
//   return ((await response.json()) as CompanyInfoResponse).results;
// }
