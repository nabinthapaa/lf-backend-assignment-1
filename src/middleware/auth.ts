import { NextFunction, Response } from "express";
import { verify } from "jsonwebtoken";
import config from "../config";
import { BaseError, UnauthenticatedError } from "../errors";
import { Request } from "../interface/auth";
import { IUser } from "../interface/user";

export function auth(req: Request, _: Response, next: NextFunction) {
  const { authorization } = req.headers;

  if (!authorization) {
    next(new UnauthenticatedError());
    return;
  }

  const token = authorization.split(" ");

  if (token.length !== 2 || token[0] !== "Bearer") {
    next(new UnauthenticatedError());
    return;
  }

  verify(token[1], config.jwt.secret!, (error, data) => {
    if (error) {
      next(new BaseError(error.message));
    }

    if (typeof data !== "string" && data)
      req.user = data as Omit<IUser, "password">;
  });
  next();
}
