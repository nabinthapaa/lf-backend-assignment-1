import httpStatusCode from "http-status-codes";
import { BaseError } from "./BaseError";

export class BadRequestError extends BaseError {
  constructor(message: string) {
    super(message, httpStatusCode.BAD_REQUEST);
  }
}
