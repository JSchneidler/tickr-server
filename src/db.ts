import { PrismaClient } from "@prisma/client";

export default new PrismaClient({
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
