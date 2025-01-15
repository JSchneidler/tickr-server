import { pbkdf2, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { Strategy as LocalStrategy } from "passport-local";
import { Authenticator } from "@fastify/passport";

import db from "./db";
import { Prisma } from "@prisma/client";

type User = Prisma.UserGetPayload<{
  omit: { password_hash: true; salt: true };
}>;

export const pbkdf2Async = promisify(pbkdf2);

const fastifyPassport = new Authenticator();

fastifyPassport.registerUserSerializer<User, number>(async (user) =>
  Promise.resolve(user.id),
);

fastifyPassport.registerUserDeserializer<number, User>(async (id) => {
  return await db.user.findFirstOrThrow({ where: { id } });
});

// TODO: Fix this? Find async version of passport-local?
// eslint-disable-next-line @typescript-eslint/no-misused-promises
export const local = new LocalStrategy(async (email, password, done) => {
  try {
    // TODO: Move to db/users.ts?
    const user = await db.user.findFirstOrThrow({
      where: { email },
      omit: { password_hash: false, salt: false },
    });
    const derivedKey = await pbkdf2Async(
      password,
      user.salt,
      100000,
      64,
      "sha512",
    );

    if (timingSafeEqual(derivedKey, Buffer.from(user.password_hash)))
      done(null, user);
    else done(null, false);
  } catch (error) {
    done(error);
  }
});

fastifyPassport.use("local", local);
export default fastifyPassport;
