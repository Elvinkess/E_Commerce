"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductDB = void 0;
const base_db_1 = require("./base_db");
const product_config_1 = require("../config/product_config");
class ProductDB extends base_db_1.BaseDb {
    constructor(myDataSource) {
        super(myDataSource, product_config_1.ProductConfig);
    }
}
exports.ProductDB = ProductDB;
