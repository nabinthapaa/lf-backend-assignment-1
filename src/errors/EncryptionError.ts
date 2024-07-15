import httpStatusCode from "http-status-codes";
import { BaseError } from "./BaseError";

export class EncryptionError extends BaseError {
  constructor(message: string = "Could not process provided information") {
    super(message, httpStatusCode.UNPROCESSABLE_ENTITY);
  }
}
