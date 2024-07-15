import bcrypt from "bcryptjs";
import { EncryptionError, NotFoundError, UserExistsError } from "../errors";
import { IUser } from "../interface/user";
import * as UserModel from "../models/User.model";
import { UUID } from "../types/types";
import { getUUID } from "../utils/getUUID";

/**
 * Retrieves user information by ID.
 *
 * @param {UUID} id - The id of user to search for.
 * @returns {Promise<Omit<IUser, "password">> } - details of user.
 * @throws {NotFoundError} - If user with `id` not found.
 */
export async function getUserById(id: UUID): Promise<Omit<IUser, "password">> {
  const data = await UserModel.getUserById(id);
  if (!data) {
    throw new NotFoundError(`User with ${id} not found`);
  }
  return data;
}

/**
 * Creates a new user with hashed password
 *
 * @param {IUser} user - The details of user to create
 * @returns {Promise<Omit<IUser, "password">>} - newly created user
 */
export async function createUser(
  user: Omit<IUser, "id">,
): Promise<Omit<IUser, "password">> {
  const existingUser = await UserModel.getUserByEmail(user.email);
  if (existingUser) {
    throw new UserExistsError(`User with ${user.email} already exists`);
  }
  const hashedPassword = await bcrypt.hash(user.password, 10);
  const hashedUser = {
    id: getUUID(),
    name: user.name,
    email: user.email,
    password: hashedPassword,
    permissions: user.permissions || [],
  };
  const data = await UserModel.createUser(hashedUser);
  return data;
}

/**
 * Updates user information by ID.
 *
 * @param {UUID} id - The id of the user to update.
 * @param {Partial<IUser>} data - User object containing any of name, password or email
 * @returns {Promise<Omit<IUser, "password">>} - updated user
 */
export async function updateUser(
  id: UUID,
  data: Partial<IUser>,
): Promise<Omit<IUser, "password">> {
  const { name, email, password } = data;
  if (!name && !email && !password) {
    throw new EncryptionError(`No data provided to update`);
  }
  const existingUser = getUserById(id);
  if (!existingUser) {
    throw new NotFoundError(`User with ${id} not found`);
  }
  const dataToUpdate: Partial<IUser> = {};
  if (name) dataToUpdate.name = name;
  if (email) dataToUpdate.email = email;
  if (password) dataToUpdate.password = await bcrypt.hash(password, 10);
  const updatedUser = await UserModel.updateUser(id, dataToUpdate);
  return updatedUser;
}

/**
 * Deletes a user by ID from the database.
 *
 * @param {UUID} id - The ID of the user to delete.
 * @returns {Promise<{ message: string }>} - success message.
 */
export async function deleteUser(id: UUID): Promise<{ message: string }> {
  await UserModel.deleteUser(id);
  return {
    message: "User deleted Successfully",
  };
}

/**
 * Retrieves user information by email.
 *
 * @param {string} email - The email address of the user to retrieve.
 * @returns {Promise<Omit<IUser, "password">>} - user information
 */
export async function getUserByEmail(email: string): Promise<IUser> {
  const data = await UserModel.getUserByEmail(email);
  if (!data) {
    throw new NotFoundError(`User with ${email} not found`);
  }
  return data;
}

/**
 * Retrieves all users from the database.
 *
 * @returns {Promise<IUser[]>} - An array of user objects.
 */
export async function getAllUsers(): Promise<IUser[]> {
  return await UserModel.getUsers();
}
