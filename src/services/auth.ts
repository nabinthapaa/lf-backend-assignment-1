import config from "../config";
import { BadRequestError, BaseError, UnauthenticatedError } from "../errors";
import { IUser } from "../interface/user";
import { getUserByEmail } from "./user";
import bcrypt from "bcryptjs";
import { sign } from "jsonwebtoken";

export async function login(data: Pick<IUser, "email" | "password">) {
  const existingUser = await getUserByEmail(data.email);

  if (!existingUser) {
    throw new BadRequestError("Invalid email or password");
  }

  const isValidPassword = await bcrypt.compare(
    data.password,
    existingUser.password,
  );

  if (!isValidPassword) {
    throw new UnauthenticatedError("Invalid Password");
  }

  const payload = {
    id: existingUser.id,
    name: existingUser.name,
    email: existingUser.email,
    permissions: existingUser.permissions,
  };

  if (!config.jwt.secret) {
    throw new BaseError("Internal Error. Contact tech support");
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
    payload,
  };
}
