"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderPaymentDB = void 0;
const order_payment_config_1 = require("../config/order_payment_config");
const base_db_1 = require("./base_db");
class OrderPaymentDB extends base_db_1.BaseDb {
    constructor(myDataSource) {
        super(myDataSource, order_payment_config_1.OrderPaymentConfig);
    }
}
exports.OrderPaymentDB = OrderPaymentDB;
