import { HttpErrors } from "../../../domain/entity/error";

export class BadRequestError extends HttpErrors {
    constructor(message = "Bad Request") {
      super(message, 400);
    }
  }