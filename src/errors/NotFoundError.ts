import httpStatusCode from "http-status-codes";
import { BaseError } from "./BaseError";
import loggerWithNameSpace from "../utils/logger";

export class NotFoundError extends BaseError {
  constructor(message: string = "") {
    super(message, httpStatusCode.NOT_FOUND);
    this.message = message;
  }
}
