"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inventory = void 0;
const my_base_entity_1 = require("./shared/my_base_entity");
class inventory extends my_base_entity_1.MyBaseEntity {
    constructor(quantity_available, quantity_sold, product_id) {
        super(0);
        this.quantity_available = quantity_available;
        this.quantity_sold = quantity_sold;
        this.product_id = product_id;
    }
}
exports.inventory = inventory;
