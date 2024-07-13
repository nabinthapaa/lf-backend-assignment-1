import { NextFunction, Response } from "express";
import { verify } from "jsonwebtoken";
import config from "../config";
import { BaseError, UnauthenticatedError } from "../errors";
import { Request } from "../interface/auth";
import { IUser } from "../interface/user";

/**
 * Middleware function to authenticate requests using JWT token.
 *
 * @param {Request} req - The `Custom Request` inheriting express Request object.
 * @param {Response} res - Response object (unused in this function).
 * @param {NextFunction} next - NextFunction object (unused in this function).
 * @throws {UnauthenticatedError} - If authorization header is missing or invalid.
 * @throws {BaseError} - If there is an issue verifying the JWT token.
 */
export function authenticate(req: Request, res: Response, next: NextFunction) {
  const { authorization } = req.headers;

  if (!authorization) {
    throw new UnauthenticatedError();
  }

  const token = authorization.split(" ");

  if (token.length !== 2 || token[0] !== "Bearer") {
    throw new UnauthenticatedError();
  }

  verify(token[1], config.jwt.secret!, (error, data) => {
    if (error) {
      console.log("JWT Token", token[1]);
      throw new BaseError(error.message);
    }

    if (typeof data !== "string" && data)
      req.user = data as Omit<IUser, "password">;
  });
}
