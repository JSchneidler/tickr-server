import { FastifyReply, FastifyRequest } from "fastify";

import { getUsers, getUser, updateUser, deleteUser } from "./user.service";
import { GetUserParams, UserUpdateInput } from "./user.schema";
import { Role } from "@prisma/client";

export async function getUsersHandler() {
  return await getUsers();
}

export async function getUserHandler(
  req: FastifyRequest<{ Params: GetUserParams }>,
  rep: FastifyReply,
) {
  if (req.user.id === req.params.userId || req.user.role === Role.ADMIN)
    return await getUser(req.params.userId);
  else rep.code(403).send("Insufficient permission");
}

export async function updateUserHandler(
  req: FastifyRequest<{ Params: GetUserParams; Body: UserUpdateInput }>,
  rep: FastifyReply,
) {
  if (req.user.id === req.params.userId || req.user.role === Role.ADMIN)
    return await updateUser(req.params.userId, req.body);
  else rep.code(403).send("Insufficient permission");
}

export async function deleteUserHandler(
  req: FastifyRequest<{ Params: GetUserParams }>,
  rep: FastifyReply,
) {
  const id = req.params.userId;
  if (req.user.id === id || req.user.role === Role.ADMIN) {
    await deleteUser(id);
    return id;
  } else rep.code(403).send("Insufficient permission");
}
