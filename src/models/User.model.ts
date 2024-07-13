import path from "path";
import { NotFoundError, UserExistsError } from "../errors";
import { IUser } from "../interface/user";
import { UUID } from "../types/types";
import { getFileContents, writeContentsToFile } from "../utils/fileHandler";

const pathToUserData = path.join(__dirname, "../data/user.json");

/**
 * Give the information about all the users
 * @returns {Promise<IUser[]>} - Array of users
 */
export async function getUsers(): Promise<IUser[]> {
  const fileContents = await getFileContents(pathToUserData);
  return JSON.parse(fileContents) as IUser[];
}

/**
 * Returns a single user based on their id
 *
 * @param {UUID} id - Id of user whose data is to be retrieved
 * @returns {Promise<Omit<IUser, "password">>} - Data of requested user
 * @throws {NotFoundError} - When user is not found
 */
export async function getUserById(id: UUID): Promise<Omit<IUser, "password">> {
  const fileContents = await getFileContents(pathToUserData);
  const userData = JSON.parse(fileContents) as IUser[];
  const user = userData.find(({ id: userId }) => userId === id);
  if (user) {
    const { password, ...otherInfo } = user;
    return otherInfo;
  }
  throw new NotFoundError(`User with ${id} does not exits`);
}

/**
 * Returns a single user based on their email for authentication
 *
 * @param {string} email - email of user whose data is to be retrieved
 * @returns {Promise<IUser>} - Data of requested user
 * @throws {NotFoundError} - When user is not found
 */
export async function getUserByEmail(email: string): Promise<IUser> {
  const fileContents = await getFileContents(pathToUserData);
  const userData = JSON.parse(fileContents) as IUser[];
  const user = userData.find(({ email: userEmail }) => userEmail === email);
  if (!user) {
    throw new NotFoundError(`User with ${email} not found`);
  }
  return user;
}

/**
 * Crates a user based on data provided
 *
 * @param {IUser} user - data of user to be created
 * @returns {Promise<Omit<IUser, "password">>} - newly created User
 * @throws {UserExistsError} - if provided email already in use
 */
export async function createUser(
  user: IUser,
): Promise<Omit<IUser, "password">> {
  const fileContents = await getFileContents(pathToUserData);
  const userData = JSON.parse(fileContents) as IUser[];

  const userExists = userData.find(({ email }) => email === user.email);
  if (userExists) {
    throw new UserExistsError(`User with ${user.email} already exists`);
  }
  userData.push(user);

  const dataToWrite = JSON.stringify(userData);
  await writeContentsToFile(dataToWrite, pathToUserData);

  const { password, ...otherInfo } = user;
  return otherInfo;
}

/**
 * Updates user based on data provided
 *
 * @param {UUID} id - id of the user to be updated
 * @param {IUser} data - data of user to be updated
 * @returns {Promise<Omit<IUser, "password">>} - updated created User
 * @throws {NotFoundError} - When user is not found
 */
export async function updateUser(
  id: UUID,
  data: Partial<IUser>,
): Promise<Omit<IUser, "password">> {
  const fileContents = await getFileContents(pathToUserData);
  const userData = JSON.parse(fileContents) as IUser[];

  const userIndex = userData.findIndex(({ id: userId }) => userId === id);
  if (userIndex === -1) {
    throw new NotFoundError(`User with ${id} not found`);
  }

  userData[userIndex] = {
    ...userData[userIndex],
    ...data,
  };

  const dataToWrite = JSON.stringify(userData);
  await writeContentsToFile(dataToWrite, pathToUserData);
  const { password, ...otherInfo } = userData[userIndex];
  return otherInfo;
}

/**
 * Deletes user based on id provided
 *
 * @param {UUID} id - id of the user to be deleted
 * @returns {Promise<void>}
 */
export async function deleteUser(id: UUID): Promise<void> {
  const fileContents = await getFileContents(pathToUserData);
  const userData = JSON.parse(fileContents) as IUser[];
  const updatedUserData = userData.filter(({ id: userId }) => userId !== id);

  const dataToWrite = JSON.stringify(updatedUserData);
  await writeContentsToFile(dataToWrite, pathToUserData);
}
