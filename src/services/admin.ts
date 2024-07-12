import { UUID } from "../types/types";
import { IUser } from "../interface/user";
import * as UserService from "./user";

export async function getUser(id: UUID | undefined) {
  if (id) {
    return await UserService.getUserInfo(id);
  } else {
    return await UserService.getAllUsers();
  }
}

export async function createUser(user: IUser) {
  return await UserService.createUser(user);
}

export async function updateUser(user: IUser) {
  const { id, ...otherUserInfo } = user;
  return await UserService.updateUser(user.id, { ...otherUserInfo });
}

export async function deleteUser(userId: UUID) {
  return await UserService.deleteUser(userId);
}
