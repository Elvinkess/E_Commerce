"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadRequestError = void 0;
const error_1 = require("../../../domain/entity/shared/error");
class BadRequestError extends error_1.HttpErrors {
    constructor(message = "Bad Request") {
        super(message, 400);
    }
}
exports.BadRequestError = BadRequestError;
