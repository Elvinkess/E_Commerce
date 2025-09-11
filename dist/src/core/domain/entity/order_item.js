"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderItem = void 0;
const my_base_entity_1 = require("./shared/my_base_entity");
class OrderItem extends my_base_entity_1.MyBaseEntity {
    constructor(order_id, product_id, product_name, quantity, price, created_at, message = "") {
        super(0);
        this.order_id = order_id;
        this.product_id = product_id;
        this.product_name = product_name;
        this.quantity = quantity;
        this.price = price;
        this.created_at = created_at;
        this.message = message;
    }
}
exports.OrderItem = OrderItem;
