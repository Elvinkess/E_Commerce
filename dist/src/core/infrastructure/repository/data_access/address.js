"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressDB = void 0;
const address_config_1 = require("../config/address_config");
const base_db_1 = require("./base_db");
class AddressDB extends base_db_1.BaseDb {
    constructor(myDataSource) {
        super(myDataSource, address_config_1.AddressConfig);
    }
}
exports.AddressDB = AddressDB;
