import { PrismaClient } from "./generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL,
});

export default new PrismaClient({
  adapter,
  omit: {
    user: {
      password_hash: true,
      salt: true,
    },
    accessToken: {
      token_hash: true,
    },
  },
});
