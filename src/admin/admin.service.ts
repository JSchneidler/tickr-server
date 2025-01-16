// import { Prisma } from "@prisma/client";

// import db from "./db";

export function banUser(user_id: number) {
  console.log(`BAN ${user_id.toString()}`);
}

export function getHoldingsForUser(user_id: number) {
  console.log(`GET HOLDINGS FOR USER ${user_id.toString()}`);
}

export default {
  banUser,
  getHoldingsForUser,
};
