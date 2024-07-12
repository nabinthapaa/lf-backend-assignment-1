import { UUID } from "../types/types";
import { IUser } from "../interface/user";
import * as UserModel from "../models/User";
import { getUUID } from "../utils/getUUID";
import bcrypt from "bcryptjs";
import { NotFoundError } from "../errors/NotFoundError";
import { BaseError } from "../errors/BaseError";
import { permission } from "process";

export async function getUserInfo(id: UUID) {
  const data = await UserModel.getUserInfo(id);
  if (!data) {
    throw new NotFoundError(`User with ${id} not found`);
  }
  return data;
}

export async function createUser(user: IUser) {
  const hashedPassword = await bcrypt.hash(user.password, 10);
  const hashedUser = {
    id: getUUID(),
    name: user.name,
    email: user.email,
    password: hashedPassword,
    permissions: [],
  };
  const data = await UserModel.createUser(hashedUser);
  return data;
}

export async function updateUser(id: UUID, data: Partial<IUser>) {
  const { name, email, password } = data;
  const dataToUpdate: Partial<IUser> = {};
  if (name) dataToUpdate.name = name;
  if (email) dataToUpdate.email = email;
  // TODO: Change password only after comparing current password
  if (password) dataToUpdate.password = await bcrypt.hash(password, 10);
  return await UserModel.updateUser(id, dataToUpdate);
}

export async function deleteUser(id: UUID) {
  await UserModel.deleteUser(id);
  return {
    message: "User deleted Successfully",
  };
}

export async function getUserByEmail(email: string) {
  const data = await UserModel.getUserByEmail(email);
  if (data) {
    return data;
  }
  throw new BaseError(`User with ${email} not found`);
}

export async function getAllUsers() {
  return await UserModel.getUsers();
}
