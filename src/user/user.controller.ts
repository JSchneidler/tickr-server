import { FastifyRequest } from "fastify";

import { getUsers, getUser, updateUser, deleteUser } from "./user.service";
import { GetUserInput, UpdateUserInput } from "./user.schema";

export async function getUsersHandler() {
  return await getUsers();
}

export async function getUserHandler(
  req: FastifyRequest<{ Params: GetUserInput }>,
) {
  return await getUser(req.params.user_id);
}

export async function updateUserHandler(
  req: FastifyRequest<{ Params: GetUserInput; Body: UpdateUserInput }>,
) {
  return await updateUser(req.params.user_id, req.body);
}

export async function deleteUserHandler(
  req: FastifyRequest<{ Params: GetUserInput }>,
) {
  const id = req.params.user_id;
  await deleteUser(id);
  return id;
}
