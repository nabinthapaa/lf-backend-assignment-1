import { NextFunction, Response } from "express";
import Joi from "joi";
import { BadRequestError } from "../errors";
import { Request } from "../interface/auth";
import { IQueryUser, IUser } from "../interface/user";

export function validateUserQuery(QueryFormat: Joi.ObjectSchema) {
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

export function validateUserBody(QueryFormat: Joi.ObjectSchema) {
  return (
    req: Request<any, any, IUser, IQueryUser>,
    _: Response,
    __: NextFunction,
  ) => {
    const { error, value } = QueryFormat.validate(req.body);

    if (error) {
      throw new BadRequestError(error.message);
    }

    req.body = value;
  };
}
