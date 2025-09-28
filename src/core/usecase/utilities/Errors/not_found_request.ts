import { HttpErrors } from "../../../domain/entity/shared/error";

export class NotFoundError extends HttpErrors{
    constructor(message="Not found"){
        super(message,404)
    }
}