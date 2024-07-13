import httpStatusCode from "http-status-codes";
import { BaseError } from "./BaseError";

export class ForbiddenError extends BaseError {
  constructor() {
    super(
      "You do not have the permission to perform the action",
      httpStatusCode.FORBIDDEN,
    );
  }
}
