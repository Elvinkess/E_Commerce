"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cart = void 0;
const my_base_entity_1 = require("./shared/my_base_entity");
class Cart extends my_base_entity_1.MyBaseEntity {
    constructor(user_id, cart_item_ids, user_status) {
        super(0);
        this.user_id = user_id;
        this.cart_item_ids = cart_item_ids;
        this.user_status = user_status;
    }
}
exports.Cart = Cart;
