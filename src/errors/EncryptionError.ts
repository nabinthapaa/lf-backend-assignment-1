import httpStatusCode from "http-status-codes";
import { BaseError } from "./BaseError";

export class EncryptionError extends BaseError {
  constructor() {
    super(
      "Could not process provided information",
      httpStatusCode.UNPROCESSABLE_ENTITY,
    );
  }
}
