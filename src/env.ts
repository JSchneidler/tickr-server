import dotenv from "dotenv";
import { Type } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";

dotenv.config();

const envSchema = Type.Object({
  FINNHUB_API_KEY: Type.String(),
  SESSION_SECRET: Type.String(),
});

const env = Value.Parse(envSchema, process.env);

export default env;
