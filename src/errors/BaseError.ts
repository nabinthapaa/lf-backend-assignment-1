import httpStatusCode from "http-status-codes";

export class BaseError extends Error {
  statusCode: number;
  constructor(
    message: string = "",
    statusCode = httpStatusCode.INTERNAL_SERVER_ERROR,
  ) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
  }
}
