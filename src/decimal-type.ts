import { Unsafe } from "@sinclair/typebox";
import { Prisma } from "@prisma/client";

export const Decimal = Unsafe<Prisma.Decimal>({
  type: "string",
});

export const NullableDecimalType = Unsafe<Prisma.Decimal | null>({
  type: ["string", "null"],
});
