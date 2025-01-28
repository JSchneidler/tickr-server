import { FastifyReply, FastifyRequest } from "fastify";
import { Role } from "@prisma/client";

import { getUsers, getUser, updateUser, deleteUser } from "./user.service";
import { GetUserParams, UpdateUserRequestBody } from "./user.schema";

export async function getUsersHandler(req: FastifyRequest, rep: FastifyReply) {
  if (req.user?.role === Role.ADMIN) return await getUsers();
  else rep.code(403).send("Insufficient permission");
}

export async function getUserHandler(
  req: FastifyRequest<{ Params: GetUserParams }>,
  rep: FastifyReply,
) {
  if (req.user?.role === Role.ADMIN) return await getUser(req.params.userId);
  else rep.code(403).send("Insufficient permission");
}

export async function updateUserHandler(
  req: FastifyRequest<{ Params: GetUserParams; Body: UpdateUserRequestBody }>,
  rep: FastifyReply,
) {
  if (req.user?.role === Role.ADMIN)
    return await updateUser(req.params.userId, req.body);
  else rep.code(403).send("Insufficient permission");
}

export async function deleteUserHandler(
  req: FastifyRequest<{ Params: GetUserParams }>,
  rep: FastifyReply,
) {
  if (req.user?.role === Role.ADMIN) {
    await deleteUser(req.params.userId);
  } else rep.code(403).send("Insufficient permission");
}
