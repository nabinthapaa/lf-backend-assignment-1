import { UUID } from "crypto";
import { NextFunction, Request, Response } from "express";
import httpStatusCode from "http-status-codes";
import { BadRequestError, BaseError, NotFoundError } from "../errors";
import { IUser } from "../interface/user";
import * as UserService from "../services/user";
import loggerWithNameSpace from "../utils/logger";
import { error } from "console";

interface Query {
  id?: UUID;
}

const logger = loggerWithNameSpace("UserController");

export function getUserInfo(
  req: Request<any, any, any, Query>,
  res: Response,
  next: NextFunction,
) {
  const { id } = req.query;
  if (!id) return next(new BadRequestError("Id is required"));
  UserService.getUserInfo(id!)
    .then((value) => {
      return res.status(httpStatusCode.OK).json(value);
    })
    .catch((err) => {
      next(new NotFoundError(err.message));
    });
}

export function createUser(
  req: Request<any, any, IUser>,
  res: Response,
  next: NextFunction,
) {
  const { body } = req;
  const { email, password, name } = body;
  if (!email || !password || !name) {
    return res.status(httpStatusCode.BAD_REQUEST).json({
      error: "All the required fields are not provided",
    });
  }
  UserService.createuser(body)
    .then((value) => {
      return res.status(httpStatusCode.OK).json({
        message: "User created Successfully",
        data: value,
      });
    })
    .catch((err) => {
      logger.error("Could not create user", err.message);
      next(new BaseError("Could not create user"));
    });
}

export function updateUser(
  req: Request<any, any, Partial<IUser>, Query>,
  res: Response,
  next: NextFunction,
) {
  const { id } = req.query;
  const { body } = req;
  if (!id) {
    return res.status(httpStatusCode.BAD_REQUEST).json({
      error: "Id is required",
    });
  }
  UserService.updateUser(id, body)
    .then((value) => {
      return res.status(httpStatusCode.OK).json(value);
    })
    .catch((_) => {
      next(new BaseError("Could not update user"));
    });
}

export function deleteUser(
  req: Request<any, any, any, Query>,
  res: Response,
  next: NextFunction,
) {
  const { id } = req.query;
  if (!id) {
    throw new BadRequestError("Id is required");
  }
  UserService.deleteUser(id)
    .then((value) => {
      res.status(httpStatusCode.OK).json(value);
    })
    .catch((e) => {
      next(new BaseError("Could not delete user"));
    });
}
