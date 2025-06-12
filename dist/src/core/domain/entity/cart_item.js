"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartItem = void 0;
const my_base_entity_1 = require("./shared/my_base_entity");
class CartItem extends my_base_entity_1.MyBaseEntity {
    constructor(cart_id, product_id, purchased_price, quantity) {
        let _id = 0;
        super(_id);
        this.cart_id = cart_id;
        this.product_id = product_id;
        this.purchased_price = purchased_price;
        this.quantity = quantity;
    }
}
exports.CartItem = CartItem;
