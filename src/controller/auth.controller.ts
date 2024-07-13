import { Response } from "express";
import * as AuthService from "../services/auth.services";
import { IUser } from "../interface/user";
import { sign, verify } from "jsonwebtoken";
import config from "../config";
import loggerWithNameSpace from "../utils/logger";
import { Request } from "../interface/auth";
import httpStatusCode from "http-status-codes";
import { BaseError, UnauthenticatedError } from "../errors";
import { UnavailableService } from "../errors/UnavailableService";

interface LoginInfo extends Pick<IUser, "email" | "password"> {}

const logger = loggerWithNameSpace("AuthController");

export async function login(req: Request<any, any, LoginInfo>, res: Response) {
  const data = req.body;
  const service_response = await AuthService.login(data);
  if (service_response) {
    logger.info(`User with id ${service_response.payload.id} logged in`);
    return res.status(httpStatusCode.OK).json({
      accessToken: service_response.accessToken,
      refrehToken: service_response.refreshToken,
    });
  }
}

export async function refresh(req: Request, res: Response) {
  const { authorization } = req.headers;

  if (!authorization) {
    throw new UnauthenticatedError();
  }

  const token = authorization.split(" ");

  if (token.length !== 2 || token[0] !== "Bearer") {
    throw new UnavailableService();
  }

  verify(token[1], config.jwt.secret!, (error, data) => {
    if (error) {
      console.log(token[1]);
      throw new BaseError(error.message);
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
