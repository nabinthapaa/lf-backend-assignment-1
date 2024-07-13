import { NextFunction, Response } from "express";
import { Request } from "../interface/auth";
import loggerWithNameSpace from "../utils/logger";

const logger = loggerWithNameSpace("Request Logger");

/**
 * Logs incoming HTTP requests.
 */
export function requestLogger(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  logger.info(`${req.method}: ${req.url}`);

  next();
}
