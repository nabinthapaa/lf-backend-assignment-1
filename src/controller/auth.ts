import { Request, Response } from "express";
import * as AuthService from "../services/auth";
import { IUser } from "../interface/user";
import { sign, verify } from "jsonwebtoken";
import config from "../config";

interface LoginInfo extends Pick<IUser, "email" | "password"> {}

export async function login(req: Request<any, any, LoginInfo>, res: Response) {
  const data = req.body;
  try {
    const service_response = await AuthService.login(data);
    if (!service_response.error) {
      res.status(200).json({
        message: "Login successfull",
        payload: service_response,
      });
    }

    res.status(404).json({
      error: service_response.error || "Login failure internal error",
    });
  } catch (e) {
    if (e instanceof Error) {
      console.log("AuthController -> login");
      res.status(404).json({
        error: e.message,
      });
    }
  }
}

export async function refresh(req: Request, res: Response) {
  console.log("Refreshing Token");
  const { authorization } = req.headers;

  if (!authorization) {
    res.status(404).json({
      error: "Invalid token",
    });
    return;
  }

  const token = authorization.split(" ");

  if (token.length !== 2 || token[0] !== "Bearer") {
    res.status(404).json({
      error: "Invalid method",
    });
    return;
  }

  verify(token[1], config.jwt.secret!, (error, data) => {
    if (error) {
      res.status(404).json({
        error: error.message,
      });
    }

    if (typeof data !== "string" && data) {
      const payload = {
        id: data.id,
        name: data.name,
        email: data.email,
      };
      const accessToken = sign(payload, config.jwt.secret!);
      const refreshToken = token[1];

      res.status(200).json({
        accessToken,
        refreshToken,
      });
    }
  });
}
