import { UUID } from "crypto";
import { IUser } from "../interface/user";
import * as UserModel from "../models/User";
import { getUUID } from "../utils/getUUID";
import { hash } from "bcrypt";
import { NotFoundError } from "../errors/NotFoundError";
import { BaseError } from "../errors/BaseError";

export async function getUserInfo(id: UUID) {
  const data = await UserModel.getUserInfo(id);
  if (!data) {
    throw new NotFoundError(`User with ${id} not found`);
  }
  return data;
}

export async function createuser(user: IUser) {
  try {
    const hashedPassword = await hash(user.password, 10);
    const hashedUser = {
      id: getUUID(),
      name: user.name,
      email: user.email,
      password: hashedPassword,
    };
    return await UserModel.createuser(hashedUser);
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(e.message);
    }
  }
}

export async function updateUser(id: UUID, data: Partial<IUser>) {
  const { name, email, password } = data;
  const dataToUpdate: Partial<IUser> = {};
  if (name) dataToUpdate.name = name;
  if (email) dataToUpdate.email = email;
  // TODO: Change password only after comparing current password
  if (password) dataToUpdate.password = await hash(password, 10);
  return await UserModel.updateUser(id, dataToUpdate);
}

export async function deleteUser(id: UUID) {
  try {
    await UserModel.deleteUser(id);
    return {
      message: "User deleted Successfully",
    };
  } catch (e) {
    if (e instanceof Error) {
      throw new BaseError(e.message);
    }
  }
}

export async function getUserByEmail(email: string) {
  const data = await UserModel.getUserByEmail(email);
  if (data) {
    return data;
  }

  throw new BaseError(`User with ${email} not found`);
}
