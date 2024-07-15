import { IUser } from "../interface/user";
import { UUID } from "../types/types";
import * as UserService from "./user.services";

/**
 * Search the user based on id if provided
 * else returns all the users
 *
 * @param {UUID | undefined} id - id based on which user is to be searched
 * @returns {Promise<Omit<IUser, "password"> | IUser[]>}
 */
export async function getUser(
  id?: UUID | undefined,
): Promise<Omit<IUser, "password"> | IUser[]> {
  if (id) {
    return await UserService.getUserById(id);
  } else {
    return await UserService.getAllUsers();
  }
}

/**
 * Creates a new user based on the provided data
 *
 * @param {IUser} user - User to create
 * @returns {Promise<Omit<IUser, "password">>} - newly created user
 */
export async function createUser(
  user: IUser,
): Promise<Omit<IUser, "password">> {
  return await UserService.createUser(user);
}

/**
 * updates existing user based on the provided data
 *
 * @param {IUser} user - User to update
 * @returns {Promise<Omit<IUser, "password">>} - newly created user
 */
export async function updateUser(
  user: Partial<IUser>,
): Promise<Omit<IUser, "password">> {
  const { id, ...otherUserInfo } = user;
  return await UserService.updateUser(user.id, { ...otherUserInfo });
}

/**
 * Delete the user with specified id
 *
 * @param {UUID} userId - id of user to delete
 * @returns  {Promise<void>}
 */
export async function deleteUser(userId: UUID): Promise<{ message: string }> {
  return await UserService.deleteUser(userId);
}
