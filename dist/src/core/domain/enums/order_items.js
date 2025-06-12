"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderStatus = void 0;
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["PENDING"] = "pending";
    OrderStatus["SHIPPED"] = "shipped";
    OrderStatus["DELIVERED"] = "delivered";
    OrderStatus["CANCELLED"] = "cancelled";
    OrderStatus["ACTIVE"] = "active";
    OrderStatus["INACTIVE"] = "inactive";
    OrderStatus["PAID"] = "paid";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
