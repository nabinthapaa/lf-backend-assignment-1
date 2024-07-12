import httpStatusCode from "http-status-codes";
import { BaseError } from "./BaseError";

export class UnauthenticatedError extends BaseError {
  constructor() {
    super("Unauthenticated", httpStatusCode.UNAUTHORIZED);
  }
}
