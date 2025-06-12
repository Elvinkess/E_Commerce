"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriesDB = void 0;
const categories_config_1 = require("../config/categories_config");
const base_db_1 = require("./base_db");
class CategoriesDB extends base_db_1.BaseDb {
    constructor(myDataSource) {
        super(myDataSource, categories_config_1.CategoriesConfig);
    }
}
exports.CategoriesDB = CategoriesDB;
