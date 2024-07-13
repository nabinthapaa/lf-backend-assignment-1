import httpStatusCode from "http-status-codes";
import { Response } from "express";
import { Request } from "../interface/auth";
import loggerWithNameSpace from "../utils/logger";

const logger = loggerWithNameSpace("Not Found");

/**
 * Handles requests for undefined route.
 * Logs warning in server logs
 *
 * @param {Request} req - The `Custom Request` inheriting express Request object.(unused)
 * @param {Response} res - Response object representing the outgoing response (unused).
 * @returns {Response<Record<string, string>>} - Response with a status code and message indicating the route was not found.
 */
export function routeNotFound(
  req: Request,
  res: Response,
): Response<Record<string, string>> {
  logger.warn(`Route ${req.url} not found`);
  return res.status(httpStatusCode.NOT_FOUND).json({
    message: `${req.protocol}://${req.hostname}${req.originalUrl}/ is not a valid url`,
  });
}
