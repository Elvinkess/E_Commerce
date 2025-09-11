"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderHistoryResponse = exports.OrderResponse = exports.OrderItemResponse = void 0;
const order_1 = require("../../entity/order");
const order_item_1 = require("../../entity/order_item");
class OrderItemResponse extends order_item_1.OrderItem {
}
exports.OrderItemResponse = OrderItemResponse;
class OrderResponse extends order_1.Order {
}
exports.OrderResponse = OrderResponse;
class OrderHistoryResponse extends order_1.Order {
}
exports.OrderHistoryResponse = OrderHistoryResponse;
