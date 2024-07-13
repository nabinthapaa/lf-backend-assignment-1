import httpStatusCode from "http-status-codes";
import { Response } from "express";
import { Request } from "../interface/auth";
import loggerWithNameSpace from "../utils/logger";

const logger = loggerWithNameSpace("Not Found");

export function routeNotFound(req: Request, res: Response) {
  logger.warn(`Route ${req.url} not found`);
  return res.status(httpStatusCode.NOT_FOUND).json({
    message: `${req.protocol}://${req.hostname}${req.originalUrl}/ is not a valid url`,
  });
}
