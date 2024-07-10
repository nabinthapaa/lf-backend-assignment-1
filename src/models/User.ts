import { IUser } from "../interface/user";
import { UUID } from "crypto";
import path from "path";
import fs from "fs/promises";

const pathToUserData = path.join(__dirname, "../data/user.json");

export async function getUserInfo(id: UUID) {
  try {
    const parsed_data: IUser[] = await getUsersData();

    const user = parsed_data.find(({ id: userId }) => userId === id);
    if (user) {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
      };
    }
    return null;
  } catch (e) {
    if (e instanceof Error) {
      console.log("Error retrieving User info", id);
      throw new Error(e.message);
    }
  }
}

export async function createuser(user: IUser) {
  try {
    const parsed_data: IUser[] = await getUsersData();
    const userExists = parsed_data.find(({ email }) => email === user.email);
    if (userExists) {
      throw new Error(`User with ${user.email} already exists`);
    }
    parsed_data.push(user);
    await writeUserData(parsed_data);
    return user;
  } catch (e) {
    if (e instanceof Error) {
      console.log("Model -> createUser: ", e.message);
      throw new Error(e.message);
    }
  }
}

export async function updateUser(id: UUID, data: Partial<IUser>) {
  try {
    const parsed_data: IUser[] = await getUsersData();

    const user = parsed_data.filter(({ id: userId }) => userId === id);
    if (!user.length) {
      return null;
    }

    const otherUsers = parsed_data.filter(({ id: userId }) => userId !== id);
    otherUsers.push({
      ...user[0],
      ...data,
    });

    const updatedUser = otherUsers.filter(({ id: userId }) => userId === id);
    await writeUserData(otherUsers);
    return updatedUser;
  } catch (e) {
    if (e instanceof Error) {
      console.log("Model -> updateUser: ", data);
      throw new Error(e.message);
    }
  }
}

export async function deleteUser(id: UUID) {
  try {
    const parsed_data = await getUsersData();
    const filtered_users = parsed_data.filter(
      ({ id: userId }) => userId !== id,
    );

    await writeUserData(filtered_users);
  } catch (e) {
    if (e instanceof Error) {
      console.log("Model -> deleteUser: ", id);
      throw new Error(e.message);
    }
  }
}

export async function getUserByEmail(email: string) {
  try {
    const parsed_data = await getUsersData();
    const user = parsed_data.find(
      ({ email: userEmail }) => userEmail === email,
    );
    return user;
  } catch (e) {
    if (e instanceof Error) {
      console.log("Model -> deleteUser: ", email);
      throw new Error(e.message);
    }
  }
}

async function getUsersData(): Promise<IUser[]> {
  try {
    const usersData = await fs.readFile(pathToUserData, "utf8");
    const parsedData: IUser[] = JSON.parse(usersData);
    return parsedData;
  } catch (error) {
    console.error("Model -> getUsersData: ", error);
    throw new Error("Error reading user data");
  }
}

async function writeUserData(userData: IUser[]): Promise<void> {
  try {
    const data = JSON.stringify(userData, null, 2);
    await fs.writeFile(pathToUserData, data, "utf8");
  } catch (error) {
    console.error("Model -> writeUserData: ", error);
    throw new Error("Internal Error");
  }
}
