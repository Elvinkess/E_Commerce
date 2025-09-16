"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cart = void 0;
const my_base_entity_1 = require("./shared/my_base_entity");
class Cart extends my_base_entity_1.MyBaseEntity {
    constructor(cart_item_ids, user_status, user_id, guest_id) {
        super(0);
        this.cart_item_ids = cart_item_ids;
        this.user_status = user_status;
        this.user_id = user_id;
        this.guest_id = guest_id;
    }
}
exports.Cart = Cart;
