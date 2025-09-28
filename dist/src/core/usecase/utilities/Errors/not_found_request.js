"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundError = void 0;
const error_1 = require("../../../domain/entity/shared/error");
class NotFoundError extends error_1.HttpErrors {
    constructor(message = "Not found") {
        super(message, 404);
    }
}
exports.NotFoundError = NotFoundError;
