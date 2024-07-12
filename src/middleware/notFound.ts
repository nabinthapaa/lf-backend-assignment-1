import httpStatusCode from "http-status-codes";
import { Response } from "express";
import { Request } from "../interface/auth";

export function routeNotFound(req: Request, res: Response) {
  return res.status(httpStatusCode.NOT_FOUND).json({
    message: `${req.protocol}://${req.hostname}${req.originalUrl}/ is not a valid url`,
  });
}
