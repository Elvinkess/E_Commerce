"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderItemDB = void 0;
const order_item_config_1 = require("../config/order_item_config");
const base_db_1 = require("./base_db");
class OrderItemDB extends base_db_1.BaseDb {
    constructor(myDataSource) {
        super(myDataSource, order_item_config_1.OrderItemConfig);
    }
}
exports.OrderItemDB = OrderItemDB;
