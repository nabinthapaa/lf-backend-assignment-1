import { BaseError } from "./BaseError";
import httpStatusCode from "http-status-codes";

export class UserExistsError extends BaseError {
  constructor(message: string = "User already exists") {
    super(message, httpStatusCode.CONFLICT);
  }
}
