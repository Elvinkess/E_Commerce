"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpErrors = void 0;
class HttpErrors extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.HttpErrors = HttpErrors;
