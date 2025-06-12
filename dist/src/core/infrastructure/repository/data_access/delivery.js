"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryDB = void 0;
const delivery_config_1 = require("../config/delivery_config");
const base_db_1 = require("./base_db");
class DeliveryDB extends base_db_1.BaseDb {
    constructor(myDataSource) {
        super(myDataSource, delivery_config_1.DeliveryConfig);
    }
}
exports.DeliveryDB = DeliveryDB;
