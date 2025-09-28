import { HttpErrors } from "../../../domain/entity/error";

export class NotFoundError extends HttpErrors{
    constructor(message="Not found"){
        super(message,404)
    }
}