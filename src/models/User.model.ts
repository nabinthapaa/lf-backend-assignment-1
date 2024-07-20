import path from "path";
import { IPermission, IUser } from "../interface/user";
import { UUID } from "../types/types";
import { getFileContents, writeContentsToFile } from "../utils/fileHandler";
import { BaseModel } from "./Base.model";

export class UserModel extends BaseModel {
  static getUsers() {
    return this.queryBuilder()
      .select(
        "name",
        "email",
        "users.id as id",
        "permissions.permission as permissions",
      )
      .from("users")
      .leftJoin("user_permisions", "user_permisions.user_id", "users.id")
      .leftJoin("permissions", "user_permisions.permissions", "permissions.id");
  }

  static joinUserPermission(user: IUser[]): IUser {
    return {
      ...user[0],
      permissions: user.flatMap(({ permissions }) => permissions),
    };
  }

  static async getUserById(id: UUID): Promise<IUser> {
    const user = await UserModel.queryBuilder()
      .select(
        "name",
        "email",
        "users.id as id",
        "permissions.permission as permissions",
      )
      .from<IUser>("users")
      .join("user_permisions", "user_permisions.user_id", "users.id")
      .join("permissions", "user_permisions.permissions", "permissions.id")
      .where("users.id", "=", `${id}`);

    if (!user.length) {
      return null;
    }

    return UserModel.joinUserPermission(user);
  }

  static async getUserByEmail(email: string): Promise<IUser> {
    const user = await this.queryBuilder()
      .select(
        "name",
        "email",
        "users.id as id",
        "permissions.permission as permissions",
        "password",
      )
      .from("users")
      .leftJoin("user_permisions", "user_permisions.user_id", "users.id")
      .leftJoin("permissions", "user_permisions.permissions", "permissions.id")
      .where("users.email", "=", `${email}`);

    if (!user.length) {
      return null;
    }

    return {
      ...user[0],
      permissions: user.map(({ permissions }) => permissions),
    };
  }

  static async createUser(user: IUser, created_by: UUID) {
    const transaction = await UserModel.queryBuilder().transaction(
      async (trx) => {
        const { permissions, ...userData } = user;
        // INFO: Insert User data in the table
        const [userId] = await trx("users")
          .insert({ ...userData, created_by })
          .returning("id");
        if (permissions && permissions.length > 0) {
          const permission_ids = await UserModel.getPermissionsId(permissions);
          // INFO: Insert User's permission data in the user_permission table
          await Promise.all(
            permission_ids.map(async (id) => {
              await trx("user_permisions").insert({
                user_id: user.id,
                permissions: id,
              });
            }),
          );
        }

        const newUser = await trx("user")
          .select(
            "name",
            "email",
            "users.id as id",
            "permissions.permission as permissions",
          )
          .from("users")
          .leftJoin("user_permisions", "user_permisions.user_id", "users.id")
          .leftJoin(
            "permissions",
            "user_permisions.permissions",
            "permissions.id",
          )
          .where("users.id", "=", `${user.id}`);

        return UserModel.joinUserPermission(newUser);
      },
    );

    return transaction;
  }

  static async updateUser(id: string, user: Partial<IUser>): Promise<IUser> {
    const transaction = await UserModel.queryBuilder().transaction(
      async (trx) => {
        const { permissions, ...userData } = user;
        const t = trx("users")
          .update({ ...userData })
          .where({ id });
        console.log(t.toString());
        await t;
        if (permissions && permissions.length > 0) {
          const permission_ids: number[] =
            await UserModel.getPermissionsId(permissions);
          await Promise.all(
            permission_ids.map(async (id) => {
              const res = await UserModel.queryBuilder()
                .select("*")
                .from("user_permisions")
                .where(`user_id='${user.id}' and permissions=${id}`);
              if (!res.length) {
                await trx.insert({
                  user_id: user.id,
                  permissions: id,
                });
              }
            }),
          );
        }
        const newUser: IUser[] = await trx("user")
          .select(
            "name",
            "email",
            "users.id as id",
            "permissions.permission as permissions",
          )
          .from<IUser>("users")
          .leftJoin("user_permisions", "user_permisions.user_id", "users.id")
          .leftJoin(
            "permissions",
            "user_permisions.permissions",
            "permissions.id",
          )
          .where("users.id", "=", `${id}`);

        return UserModel.joinUserPermission(newUser);
      },
    );

    return transaction;
  }

  static deleteUser(id: string) {
    UserModel.queryBuilder().delete().from("users").where({ id });
  }

  private static async getPermissionsId(
    permissions: string[],
  ): Promise<number[]> {
    const permission_ids: number[][] = await Promise.all(
      permissions.map((permission) => {
        return UserModel.queryBuilder()
          .select("id")
          .from<IPermission>("permissions")
          .where({ permission });
      }),
    );
    return permission_ids[0];
  }
}

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
  return null;
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
  userData.push(user);
  const dataToWrite = JSON.stringify(userData, null, 2);
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

  userData[userIndex] = {
    ...userData[userIndex],
    ...data,
  };

  const dataToWrite = JSON.stringify(userData, null, 2);
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

  const dataToWrite = JSON.stringify(updatedUserData, null, 2);
  await writeContentsToFile(dataToWrite, pathToUserData);
}
