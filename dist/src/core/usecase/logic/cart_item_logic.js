"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartItemLogic = void 0;
const cart_item_1 = require("../../domain/entity/cart_item");
class CartItemLogic {
    constructor(cartItemDB, cartDB, productDB) {
        this.cartItemDB = cartItemDB;
        this.cartDB = cartDB;
        this.productDB = productDB;
        this.create = (cartItemData) => __awaiter(this, void 0, void 0, function* () {
            let cartExist = yield this.cartDB.getOne({ id: cartItemData.cart_id });
            let productExist = yield this.productDB.getOne({ id: cartItemData.product_id });
            let cartItems = yield this.cartItemDB.get({ cart_id: cartItemData.cart_id });
            for (let cartItem of cartItems) {
                if (cartItem.product_id === cartItemData.product_id) {
                    cartItem.quantity += cartItemData.quantity;
                    yield this.cartItemDB.update({ id: cartItem.id }, { quantity: cartItem.quantity });
                    return cartItem;
                }
            }
            if (cartExist && productExist) {
                let cartItem = new cart_item_1.CartItem(cartItemData.cart_id, cartItemData.product_id, productExist.price, cartItemData.quantity);
                cartItem = yield this.cartItemDB.save(cartItem);
                return cartItem;
            }
            else {
                throw new Error("Either of CartID or  ProductID doesn't exist");
            }
        });
        this.delete = (cartItemId) => __awaiter(this, void 0, void 0, function* () {
            let cartItem = yield this.cartItemDB.remove({ id: cartItemId });
            if (cartItem) {
                return cartItem;
            }
            else {
                throw new Error("cartItem not found hence  cannot be deleted");
            }
        });
    }
}
exports.CartItemLogic = CartItemLogic;
