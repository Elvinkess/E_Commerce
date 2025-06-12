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
exports.CartLogic = void 0;
const product_cart_response_1 = require("../../domain/dto/responses/product_cart_response");
const cart_1 = require("../../domain/entity/cart");
const cart_status_enum_1 = require("../../domain/enums/cart_status_enum");
class CartLogic {
    constructor(cartDB, userDB, cartItemDB, productDB, productlogic) {
        this.cartDB = cartDB;
        this.userDB = userDB;
        this.cartItemDB = cartItemDB;
        this.productDB = productDB;
        this.productlogic = productlogic;
        this.create = (cart) => __awaiter(this, void 0, void 0, function* () {
            let cartUserExist = yield this.userDB.get({ id: cart.user_id });
            let activeCart = yield this.cartDB.getOne({ user_id: cart.user_id, user_status: cart_status_enum_1.cart_status.ACTIVE });
            if (!cartUserExist.length) {
                throw new Error("User doesnt exist");
            }
            if (activeCart) {
                return activeCart;
            }
            else {
                let _cart = new cart_1.Cart(cart.user_id, [], cart_status_enum_1.cart_status.ACTIVE);
                return yield this.cartDB.save(_cart);
            }
        });
        this.get = (userId) => __awaiter(this, void 0, void 0, function* () {
            let activeCart = yield this.cartDB.getOne({ user_id: userId, user_status: cart_status_enum_1.cart_status.ACTIVE });
            if (!activeCart) {
                return null;
            }
            let activeCartResponse = activeCart;
            let cartItems = yield this.cartItemDB.get({ cart_id: activeCart === null || activeCart === void 0 ? void 0 : activeCart.id });
            let cartProducts = yield this.productlogic.convertProductsToProductResponsesEfficient(yield this.productDB.comparisonSearch({ _in: { id: cartItems.map(item => item.product_id) } }));
            let cartItemresponses = [];
            for (let cartItem of cartItems) {
                let product = cartProducts.find(prod => prod.id === cartItem.product_id);
                let cartitemResponse = new product_cart_response_1.CartItemResponse(cartItem);
                cartitemResponse.product = product;
                cartitemResponse.updateCartItemStatus();
                cartItemresponses.push(cartitemResponse);
            }
            activeCartResponse.cart_items = cartItemresponses;
            return activeCartResponse;
        });
        this.delete = (cartId) => __awaiter(this, void 0, void 0, function* () {
            let cart = yield this.cartDB.getOne({ id: cartId });
            if (!cart) {
                throw new Error("There's no  cart with this Id  number");
            }
            if ((cart === null || cart === void 0 ? void 0 : cart.user_status) !== cart_status_enum_1.cart_status.ACTIVE) {
                throw new Error("Cannot deleted a  cart whose status is  Active");
            }
            let cartToRemove = yield this.cartDB.remove({ id: cartId });
            return cartToRemove;
        });
    }
}
exports.CartLogic = CartLogic;
