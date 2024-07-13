import bcrypt from "bcryptjs";
import { sign } from "jsonwebtoken";
import config from "../config";
import { BadRequestError, BaseError, UnauthenticatedError } from "../errors";
import { AuthResponse } from "../interface/auth";
import { IUser } from "../interface/user";
import { getUserByEmail } from "./user.services";

/**
 * Logs in the user based on email and id provided
 *
 * @param {Pick<IUser, "email" | "password">} data - Data of user logging in
 * @returns  {Promise<AuthResponse>} - access token and refresh token
 * @throws {BadRequestError} - Invalid email
 * @throws {UnauthenticatedError} - Invalid password
 * @throws {BaseError} - if environment variables not found
 */
export async function login(
  data: Pick<IUser, "email" | "password">,
): Promise<AuthResponse> {
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
  };
}
