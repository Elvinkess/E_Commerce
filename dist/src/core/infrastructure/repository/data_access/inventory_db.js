"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryDB = void 0;
const base_db_1 = require("./base_db");
const inventory_config_1 = require("../config/inventory_config");
class InventoryDB extends base_db_1.BaseDb {
    constructor(myDataSource) {
        super(myDataSource, inventory_config_1.InventoryConfig);
    }
}
exports.InventoryDB = InventoryDB;
