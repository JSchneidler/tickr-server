// import { Prisma } from "@prisma/client";

// import db from "./db";

export function banUser(userId: number) {
  console.log(`BAN ${userId.toString()}`);
}

export function getHoldingsForUser(userId: number) {
  console.log(`GET HOLDINGS FOR USER ${userId.toString()}`);
}

export default {
  banUser,
  getHoldingsForUser,
};
