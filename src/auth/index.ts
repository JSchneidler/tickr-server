import FastifyPlugin from "fastify-plugin";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { pbkdf2, timingSafeEqual, randomBytes, createHash } from "node:crypto";
import { promisify } from "node:util";
import fastifyJwt, { JWT } from "@fastify/jwt";
import { createSigner } from "fast-jwt";

import env from "../env";
import { UserWithoutSensitive } from "../user/user.schema";
import { getUser } from "../user/user.service";

declare module "fastify" {
  interface FastifyRequest {
    jwt?: JWT;
  }

  export interface FastifyInstance {
    authenticate: (req: FastifyRequest, rep: FastifyReply) => void;
  }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    user?: UserWithoutSensitive;
  }
}

const signJwt = createSigner({
  algorithm: "HS256",
  key: async () => Promise.resolve(env.JWT_SECRET),
});

export const pbkdf2Async = promisify(pbkdf2);

export async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const hash = await pbkdf2Async(
    Buffer.from(password),
    salt,
    310000,
    32,
    "sha256",
  );

  return {
    hash,
    salt,
  };
}

export async function comparePasswordHash(
  password: Buffer,
  salt: Buffer,
  hash: Buffer,
) {
  const candidate_hash = await pbkdf2Async(
    Buffer.from(password),
    salt,
    310000,
    32,
    "sha256",
  );
  return timingSafeEqual(candidate_hash, hash);
}

export async function generateJwt(user: UserWithoutSensitive) {
  const token = await signJwt({
    id: user.id,
  });
  return {
    token,
    hash: createHash("sha256").update(token).digest(),
  };
}

export function compareJwtHash(jwt: Buffer, hash: Buffer) {
  return timingSafeEqual(jwt, hash);
}

export default FastifyPlugin(async (f: FastifyInstance) => {
  await f.register(fastifyJwt, {
    secret: env.JWT_SECRET,
  });
  f.addHook("preHandler", async (req: FastifyRequest, rep) => {
    try {
      if (req.headers.authorization) {
        await req.jwtVerify();
        req.user = await getUser(req.user.id);
      }
    } catch (err) {
      f.log.error(err);
      rep.status(401).send("Unauthorized");
    }
  });
  // f.decorateRequest("user") // TODO: Add full Prisma user as req.user
  f.decorate("authenticate", async (req: FastifyRequest, rep: FastifyReply) => {
    try {
      await req.jwtVerify();
    } catch (err) {
      rep.status(401).send(err);
    }
  });
});
