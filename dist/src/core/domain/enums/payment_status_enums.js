"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentStatus = void 0;
var paymentStatus;
(function (paymentStatus) {
    paymentStatus["PENDING"] = "pending";
    paymentStatus["PAID"] = "paid";
    paymentStatus["NOT_PAID"] = "not paid";
    paymentStatus["REVERSE"] = "reverse";
})(paymentStatus || (exports.paymentStatus = paymentStatus = {}));
