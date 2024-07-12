import { NextFunction, Response } from "express";
import HttpStatusCode from "http-status-codes";
import { BaseError } from "../errors";
import { Request } from "../interface/auth";
import loggerWithNameSpace from "../utils/logger";

const logger = loggerWithNameSpace("Error Handler");

export function NotFounnd(_: Request, res: Response) {
  return res.status(HttpStatusCode.NOT_FOUND).json({
    message: "Not Found",
  });
}

export function genericErrorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (error.stack) {
    logger.error(error.stack);
  }

  switch (true) {
    case error instanceof BaseError:
      return res.status(error.statusCode).json({
        message: error.message,
      });
    default:
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        message: "Internal Server Errror",
      });
  }
}
