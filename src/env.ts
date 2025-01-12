import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  FINNHUB_API_KEY: z.string(),
});

const env = envSchema.parse(process.env);

export default env;
