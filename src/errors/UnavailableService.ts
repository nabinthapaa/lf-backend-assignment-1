import { BaseError } from "./BaseError";
import httpStatusCode from "http-status-codes";

export class UnavailableService extends BaseError {
  constructor(message: string = "Service Unavailable") {
    super(message, httpStatusCode.SERVICE_UNAVAILABLE);
  }
}
