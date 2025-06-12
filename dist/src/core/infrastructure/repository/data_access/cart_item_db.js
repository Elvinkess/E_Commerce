"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartItemDB = void 0;
const cart_item_configs_1 = require("../config/cart_item_configs");
const base_db_1 = require("./base_db");
class CartItemDB extends base_db_1.BaseDb {
    constructor(myDataSource) {
        super(myDataSource, cart_item_configs_1.CartItemConfig);
    }
}
exports.CartItemDB = CartItemDB;
