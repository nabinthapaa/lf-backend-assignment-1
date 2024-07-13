import { NextFunction, Response } from "express";
import { Request } from "../interface/auth";

/**
 * Handles any errors which may occurs during the execution of a fucntion
 *
 * Catches and forwards error ti next error-handling middleware {@linkcode genericErrorHandler}
 *
 * @param callback {Function} - Callback to handle error for
 */
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

/**
 * Handles the execution of an array of functions in sequential order.
 * Each function is called with the parameters `(req: Request, res: Response, next: NextFunction)`.
 * Stops further execution if headers have already been sent in the response (`res.headersSent` is true).
 *
 * Catches and forwards errors to the next error-handling middleware `{@link genericErrorHandler}`.
 *
 * @param callbacks {Array.<Function>} - Array of fucntions to call
 */
export function routeHandler(callbacks: Function[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      for (let i = 0; i < callbacks.length; i++) {
        await callbacks[i](req, res, next);
        if (res.headersSent) break;
      }
    } catch (e) {
      if (e instanceof Error) {
        next(e);
      }
    }
  };
}
