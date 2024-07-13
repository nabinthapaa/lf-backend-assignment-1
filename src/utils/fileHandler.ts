import fs from "fs/promises";

export async function getFileContents(filePath: string) {
  try {
    const usersData = await fs.readFile(filePath, "utf8");
    return usersData;
  } catch (error) {
    throw new Error("Error reading user data");
  }
}

export async function writeContentsToFile(data: string, filePath: string) {
  try {
    await fs.writeFile(filePath, data, "utf8");
  } catch (error) {
    throw new Error("Internal Error");
  }
}
