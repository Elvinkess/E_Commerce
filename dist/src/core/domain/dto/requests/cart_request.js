"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCartItem = exports.addItemCartReq = void 0;
class addItemCartReq {
}
exports.addItemCartReq = addItemCartReq;
class CreateCartItem {
    constructor(cart_id, product_id, quantity) {
        this.cart_id = cart_id;
        this.product_id = product_id;
        this.quantity = quantity;
    }
}
exports.CreateCartItem = CreateCartItem;
