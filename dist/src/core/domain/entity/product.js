"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const my_base_entity_1 = require("./shared/my_base_entity");
class Product extends my_base_entity_1.MyBaseEntity {
    constructor(name, price, category_id, inventory_id, image_url = "") {
        super(0);
        this.name = name;
        this.price = price;
        this.category_id = category_id;
        this.inventory_id = inventory_id;
        this.image_url = image_url;
    }
}
exports.Product = Product;
// name, price, inventoryId, categoryId
