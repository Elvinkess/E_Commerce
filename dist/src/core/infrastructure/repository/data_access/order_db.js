"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderDB = void 0;
const order_1 = require("../config/order");
const base_db_1 = require("./base_db");
class OrderDB extends base_db_1.BaseDb {
    constructor(myDataSource) {
        super(myDataSource, order_1.OrderConfig);
    }
}
exports.OrderDB = OrderDB;
