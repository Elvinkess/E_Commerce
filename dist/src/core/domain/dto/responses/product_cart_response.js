"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartResponse = exports.CartItemResponse = exports.productInCartRes = exports.CartItemStatus = void 0;
const cart_1 = require("../../entity/cart");
const cart_item_1 = require("../../entity/cart_item");
var CartItemStatus;
(function (CartItemStatus) {
    CartItemStatus["LessQuantity"] = "less Quantity";
    CartItemStatus["OverPriced"] = "Over Priced";
    CartItemStatus["UnderPriced"] = "Under Priced";
    CartItemStatus["Unavailable"] = "Unavailable";
    CartItemStatus["Okay"] = "Okay";
})(CartItemStatus || (exports.CartItemStatus = CartItemStatus = {}));
class productInCartRes {
    constructor(_name) {
        this.name = _name;
    }
}
exports.productInCartRes = productInCartRes;
class CartItemResponse extends cart_item_1.CartItem {
    constructor(init) {
        super(init.cart_id, init.product_id, init.purchased_price, init.quantity);
        // setCatItemStatus = ()=>{
        //     if(!this.product){
        //         return CartItemStatus.Unavailable
        //     }else if(this.product.price < this.purchased_price){
        //         return  CartItemStatus.OverPriced
        //     }else if(this.product.price > this.purchased_price){
        //         return CartItemStatus.UnderPriced
        //     }else if(this.product.inventory?.quantity_available ?? 0 < this.quantity){
        //         return CartItemStatus.LessQuantity
        //     }
        //     else{
        //         return CartItemStatus.Okay
        //     }
        // }
        this.setCatItemStatus = () => {
            var _a, _b, _c;
            if (!this.product) {
                return CartItemStatus.Unavailable;
            }
            else if (((_b = (_a = this.product.inventory) === null || _a === void 0 ? void 0 : _a.quantity_available) !== null && _b !== void 0 ? _b : 0) < this.quantity) {
                console.log({ i: (_c = this.product) === null || _c === void 0 ? void 0 : _c.inventory, q: this.quantity });
                return CartItemStatus.LessQuantity;
            }
            else if (this.product.price < this.purchased_price) {
                return CartItemStatus.OverPriced;
            }
            else if (this.product.price > this.purchased_price) {
                return CartItemStatus.UnderPriced;
            }
            return CartItemStatus.Okay;
        };
        this.updateCartItemStatus = () => {
            this.status = this.setCatItemStatus();
        };
        this.id = init.id;
    }
}
exports.CartItemResponse = CartItemResponse;
class CartResponse extends cart_1.Cart {
}
exports.CartResponse = CartResponse;
