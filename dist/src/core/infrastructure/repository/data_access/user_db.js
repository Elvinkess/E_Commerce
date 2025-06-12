"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDb = void 0;
const user_config_1 = require("../config/user_config");
const base_db_1 = require("./base_db");
class UserDb extends base_db_1.BaseDb {
    constructor(myDataSource) {
        super(myDataSource, user_config_1.UserConfig);
    }
}
exports.UserDb = UserDb;
