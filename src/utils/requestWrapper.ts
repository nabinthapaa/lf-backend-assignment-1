import { NextFunction, Response } from "express";
import { Request } from "../interface/auth";

export function requestWrapper(callback: Function) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      return await callback(req, res, next);
    } catch (e) {
      if (e instanceof Error) {
        next(e);
      }
    }
  };
}

export function routeHandler(callbacks: Function[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      for (let callback of callbacks) {
        await callback(req, res, next);
      }
    } catch (e) {
      if (e instanceof Error) {
        next(e);
      }
    }
  };
}
