"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartDB = void 0;
const cart_config_1 = require("../config/cart_config");
const base_db_1 = require("./base_db");
class CartDB extends base_db_1.BaseDb {
    constructor(myDataSource) {
        super(myDataSource, cart_config_1.CartConfig);
    }
}
exports.CartDB = CartDB;
