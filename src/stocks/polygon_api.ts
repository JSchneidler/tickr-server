import env from "../env";

export interface CompanyInfo {
  description: string;
  homepage_url: string;
  market_cap: number;
  name: string;
  sic_code: string; // Standard industrial classification (SIC) code. List: https://www.sec.gov/info/edgar/siccodes.htm
  sic_description: string;
  total_employees: number;
}

export interface CompanyInfoResponse {
  results: CompanyInfo;
}

const API_BASE_URL = "https://api.polygon.io";

// TODO: Create client?
function baseRequest(url: string) {
  const request = new Request(url);
  request.headers.append("Authorization", `Bearer ${env.POLYGON_API_KEY}`);
  return request;
}

export async function getCompanyInfo(symbol: string) {
  const request = baseRequest(API_BASE_URL + `/v3/reference/tickers/${symbol}`);

  const response = await fetch(request);
  return ((await response.json()) as CompanyInfoResponse).results;
}
