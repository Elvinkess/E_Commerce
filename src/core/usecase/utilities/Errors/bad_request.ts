import { HttpErrors } from "../../../domain/entity/shared/error";

export class BadRequestError extends HttpErrors {
    constructor(message = "Bad Request") {
      super(message, 400);
    }
  }