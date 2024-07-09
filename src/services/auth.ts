import config from "../config";
import { IUser } from "../interface/user";
import { getUserByEmail } from "./user";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";

export async function login(data: Pick<IUser, "email" | "password">) {
  const existingUser = await getUserByEmail(data.email);

  if (!existingUser) {
    return {
      error: "Invalid email address",
    };
  }

  const isValidPassword = await bcrypt.compare(
    data.password,
    existingUser.password,
  );

  if (!isValidPassword) {
    return {
      error: "Invalid password",
    };
  }

  const payload = {
    id: existingUser.id,
    name: existingUser.name,
    email: existingUser.email,
  };

  if (!config.jwt.secret) {
    return {
      error: "Internal Error. Contact tech support",
    };
  }

  const accessToken = sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.accessTokenExpiryMS,
  });

  const refreshToken = sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.refreshTokenExpiryMS,
  });

  return {
    accessToken,
    refreshToken,
  };
}
