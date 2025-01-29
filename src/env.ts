import dotenv from "dotenv";
import { Type } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";

dotenv.config();

const envSchema = Type.Object({
  COINGECKO_API_KEY: Type.String(),
  FINNHUB_API_KEY: Type.String(),
  JWT_SECRET: Type.String(),
});

const env = Value.Parse(envSchema, process.env);

export default env;
