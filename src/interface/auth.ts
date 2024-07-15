import { Request as ExpressRequest, Locals } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { IUser } from "./user";

export interface Request<
  P = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = qs.ParsedQs,
  Locals extends Record<string, any> = Record<string, any>,
> extends ExpressRequest<P, ResBody, ReqBody, ReqQuery, Locals> {
  user?: Omit<IUser, "password">;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  payload: Omit<IUser, "password">;
}
