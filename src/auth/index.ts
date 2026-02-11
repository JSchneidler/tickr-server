import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  RouteGenericInterface,
} from "fastify";
import FastifyPlugin from "fastify-plugin";
import { pbkdf2, timingSafeEqual, randomBytes, createHash } from "crypto";
import { promisify } from "util";
import fastifyJwt, { JWT } from "@fastify/jwt";
import { createSigner } from "fast-jwt";

import env from "../env";
import { UserWithoutSensitive } from "../user/user.schema";
import { getUser } from "../user/user.service";

declare module "fastify" {
  interface FastifyRequest {
    jwt?: JWT;
    user: UserWithoutSensitive | undefined;
  }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    user: UserWithoutSensitive | undefined;
  }
}

const signJwt = createSigner({
  algorithm: "HS256",
  key: async () => Promise.resolve(env.JWT_SECRET),
  expiresIn: "7d",
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

export function getAuthUser(req: FastifyRequest): UserWithoutSensitive {
  if (!req.user) throw new Error("Unauthorized");
  return req.user;
}

export function authenticate<T extends RouteGenericInterface>(
  req: FastifyRequest<T>,
  rep: FastifyReply,
) {
  if (!req.user) rep.code(401).send();
}

export function requireAdmin<T extends RouteGenericInterface>(
  req: FastifyRequest<T>,
  rep: FastifyReply,
) {
  if (!req.user) {
    rep.code(401).send();
    return;
  }
  if (req.user.role !== "ADMIN") rep.code(403).send();
}

export default FastifyPlugin(async (f: FastifyInstance) => {
  await f.register(fastifyJwt, {
    secret: env.JWT_SECRET,
    cookie: {
      cookieName: "token",
      signed: true,
    },
  });

  f.addHook("onRequest", async (req: FastifyRequest) => {
    try {
      await req.jwtVerify();
      if (req.user) req.user = await getUser(req.user.id);
    } catch (err) {
      f.log.error(err);
    }
  });
});
