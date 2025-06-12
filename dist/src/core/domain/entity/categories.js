"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Categories = void 0;
const my_base_entity_1 = require("./shared/my_base_entity");
class Categories extends my_base_entity_1.MyBaseEntity {
    constructor(name, description, products) {
        let _id = 0;
        super(_id);
        this.name = name;
        this.description = description;
        this.products = products;
    }
}
exports.Categories = Categories;
