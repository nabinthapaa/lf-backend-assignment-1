import { Response } from "express";
import * as AuthService from "../services/auth";
import { IUser } from "../interface/user";
import { sign, verify } from "jsonwebtoken";
import config from "../config";
import loggerWithNameSpace from "../utils/logger";
import { Request } from "../interface/auth";
import httpStatusCode from "http-status-codes";

interface LoginInfo extends Pick<IUser, "email" | "password"> {}

const logger = loggerWithNameSpace("AuthController");

export async function login(req: Request<any, any, LoginInfo>, res: Response) {
  const data = req.body;
  try {
    const service_response = await AuthService.login(data);
    if (!service_response.error) {
      return res.status(httpStatusCode.OK).json({
        message: "Login successfull",
        payload: service_response,
      });
    }

    res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
      error: service_response.error || "Login failure internal error",
    });
  } catch (e) {
    if (e instanceof Error) {
      logger.error(`Error: ${e.message}`);
      if (e.stack) logger.error(e.stack);
      res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        error: e.message,
      });
    }
  }
}

export async function refresh(req: Request, res: Response) {
  logger.info(`${req.method}:  ${req.url}`);
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(httpStatusCode.FORBIDDEN).json({
      error: "Unauthorized",
    });
  }

  const token = authorization.split(" ");

  if (token.length !== 2 || token[0] !== "Bearer") {
    return res.status(httpStatusCode.SERVICE_UNAVAILABLE).json({
      error: "Invalid method",
    });
  }

  verify(token[1], config.jwt.secret!, (error, data) => {
    if (error) {
      res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        error: error.message,
      });
    }

    if (typeof data !== "string" && data) {
      const payload = {
        id: data.id,
        name: data.name,
        email: data.email,
      };
      const accessToken = sign(payload, config.jwt.secret!, {
        expiresIn: config.jwt.accessTokenExpiryMS,
      });
      const refreshToken = token[1];

      res.status(httpStatusCode.OK).json({
        accessToken,
        refreshToken,
      });
    }
  });
}
