import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  RouteGenericInterface,
} from "fastify";
import FastifyPlugin from "fastify-plugin";
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
    user: UserWithoutSensitive | undefined;
  }

  export interface FastifyInstance {
    authenticate: <T extends RouteGenericInterface>(
      req: FastifyRequest<T>,
      rep: FastifyReply,
    ) => void;
    admin: <T extends RouteGenericInterface>(
      req: FastifyRequest<T>,
      rep: FastifyReply,
    ) => void;
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
    cookie: {
      cookieName: "token",
      signed: false,
    },
  });
  f.addHook("onRequest", async (req: FastifyRequest) => {
    try {
      await req.jwtVerify();
      req.user = await getUser(req.user!.id); // eslint-disable-line @typescript-eslint/no-non-null-assertion
    } catch (err) {
      f.log.error(err);
    }
  });
  f.decorate(
    "authenticate",
    async <T extends RouteGenericInterface>(
      req: FastifyRequest<T>,
      rep: FastifyReply,
    ) => {
      try {
        await req.jwtVerify();
        req.user = await getUser(req.user!.id); // eslint-disable-line @typescript-eslint/no-non-null-assertion
      } catch (err) {
        f.log.error(err);
        rep.status(401).send(err);
      }
    },
  );
  f.decorate(
    "admin",
    async <T extends RouteGenericInterface>(
      req: FastifyRequest<T>,
      rep: FastifyReply,
    ) => {
      f.authenticate(req, rep);
      if (req.user?.role !== "ADMIN") rep.status(401).send();
    },
  );
});
