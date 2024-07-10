import { UUID } from "crypto";
import { IUser } from "../interface/user";
import * as UserModel from "../models/User";
import { getUUID } from "../utils/getUUID";
import { hash } from "bcrypt";

export async function getUserInfo(id: UUID) {
  try {
    const data = await UserModel.getUserInfo(id);

    if (!data) {
      throw new Error(`User with ${id} not found`);
    }

    console.log(data);
    return data;
  } catch (e) {
    if (e instanceof Error) {
      console.log("UserService -> getUserInfo", e.message);
      throw new Error(e.message);
    }
  }
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
      console.log("UserService -> createuser: ", e.message);
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
      console.log("UserService -> deleteUser");
      throw new Error(e.message);
    }
  }
}

export async function getUserByEmail(email: string) {
  const data = await UserModel.getUserByEmail(email);
  if (data) {
    console.log("UserService -> GetUserByEmail", data);
    return data;
  }

  throw new Error(`User with ${email} not found`);
}
