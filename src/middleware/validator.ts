import { NextFunction, Response } from "express";
import Joi from "joi";
import { BadRequestError } from "../errors";
import { Request } from "../interface/auth";
import { IQueryUser, IUser } from "../interface/user";

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
