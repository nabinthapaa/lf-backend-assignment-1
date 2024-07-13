import httpStatusCode from "http-status-codes";
import { BaseError } from "./BaseError";

export class UnauthenticatedError extends BaseError {
  constructor(message: string = "Unauthorized route") {
    super(message, httpStatusCode.UNAUTHORIZED);
  }
}
