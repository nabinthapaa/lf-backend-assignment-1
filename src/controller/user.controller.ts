import { Response } from "express";
import httpStatusCode from "http-status-codes";
import { BadRequestError } from "../errors";
import { Request } from "../interface/auth";
import { IUser } from "../interface/user";
import * as UserService from "../services/user.services";
import { UUID } from "../types/types";
import loggerWithNameSpace from "../utils/logger";

interface Query {
  id?: UUID;
}

const logger = loggerWithNameSpace("UserController");

/** Handles `GET` request to route `/users` */
export async function getUserInfo(
  req: Request<any, any, any, Query>,
  res: Response,
) {
  const { id } = req.query;
  logger.info(`Getting user information: ${id}`);
  const data = await UserService.getUserById(id!);
  if (res.headersSent) {
    logger.warn(`Header Sent: ${res.headersSent}. terminating`);
    return;
  }
  logger.info(`Retrived user information: ${id}`);
  return res.status(httpStatusCode.OK).json(data);
}

/** Handles `POST` request to route `/users` */
export async function createUser(req: Request<any, any, IUser>, res: Response) {
  logger.info("Creating user");
  const { body } = req;
  const { email, password, name } = body;
  if (!email || !password || !name) {
    throw new BadRequestError("All the required fields are not provided");
  }
  const data = await UserService.createUser(body);
  logger.info(`User created: ${data.id}`);
  return res.status(httpStatusCode.OK).json(data);
}

/** Handles `PUT` request to route `/users` */
export async function updateUser(
  req: Request<any, any, Partial<IUser>, Query>,
  res: Response,
) {
  const { id } = req.query;
  logger.info(`Updating user ${id}`);
  const { body } = req;
  if (!id) {
    throw new BadRequestError("Id is required");
  }
  const data = await UserService.updateUser(id, body);
  logger.info(`User updated: ${id}`);
  return res.status(httpStatusCode.OK).json(data);
}

/** Handles `DELETE` request to route `/users` */
export async function deleteUser(
  req: Request<any, any, any, Query>,
  res: Response,
) {
  logger.info("Deleting user");
  const { id } = req.query;
  if (!id) {
    throw new BadRequestError("Id is required");
  }
  let data = UserService.deleteUser(id);
  logger.info("Deleting user: ", id);
  return res.status(httpStatusCode.OK).json(data);
}
