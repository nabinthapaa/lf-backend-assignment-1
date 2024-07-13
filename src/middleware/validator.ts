import { NextFunction, Response } from "express";
import Joi from "joi";
import { BadRequestError } from "../errors";
import { Request } from "../interface/auth";
import { IQueryUser, IUser } from "../interface/user";

/**
 * Middleware function to validate request query parameters using Joi schema.
 *
 * @param {Joi.ObjectSchema} QueryFormat - The Joi schema object to validate the query parameters against.
 * @throws {BadRequestError} - If query parameters do not match the specified Joi schema.
 */
export function validateRequestQuery(QueryFormat: Joi.ObjectSchema) {
  return (
    req: Request<any, any, any, IQueryUser>,
    _: Response,
    __: NextFunction,
  ) => {
    const { error, value } = QueryFormat.validate(req.query);
    if (error) {
      throw new BadRequestError(error.message);
    }

    req.query = value;
  };
}

/**
 * Middleware function to validate request body using Joi schema.
 *
 * @param {Joi.ObjectSchema} QueryFormat - The Joi schema object to validate the body parameters against.
 * @throws {BadRequestError} - If body parameters do not match the specified Joi schema.
 */
export function validateRequestBody(QueryFormat: Joi.ObjectSchema) {
  return (
    req: Request<any, any, IUser, IQueryUser>,
    _: Response,
    __: NextFunction,
  ) => {
    const { error, value } = QueryFormat.validate({
      ...req.body,
      ...req.params,
      ...req.query,
    });

    if (error) {
      throw new BadRequestError(error.message);
    }

    req.body = value;
  };
}

/**
 * Middleware function to validate request path parameters using Joi schema.
 *
 * @param {Joi.ObjectSchema} QueryFormat - The Joi schema object to validate the path parameters against.
 * @throws {BadRequestError} - If path parameters do not match the specified Joi schema.
 */
export function validateRequestParams(QueryFormat: Joi.ObjectSchema) {
  return (
    req: Request<any, any, IUser, IQueryUser>,
    _: Response,
    __: NextFunction,
  ) => {
    const { error, value } = QueryFormat.validate(req.params);

    if (error) {
      throw new BadRequestError(error.message);
    }

    req.params = value;
  };
}
