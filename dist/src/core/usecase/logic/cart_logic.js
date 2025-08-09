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
const cart_item_1 = require("../../domain/entity/cart_item");
const cart_status_enum_1 = require("../../domain/enums/cart_status_enum");
class CartLogic {
    constructor(cartDB, userDB, cartItemDB, productDB, productlogic, cartCache, inventoryDB) {
        this.cartDB = cartDB;
        this.userDB = userDB;
        this.cartItemDB = cartItemDB;
        this.productDB = productDB;
        this.productlogic = productlogic;
        this.cartCache = cartCache;
        this.inventoryDB = inventoryDB;
        this.get = (userId) => __awaiter(this, void 0, void 0, function* () {
            //hit the redis server to get cart before the DB
            const cachedCart = yield this.cartCache.getCartResponse(userId);
            if (cachedCart) {
                return cachedCart;
            }
            let activeCart = yield this.cartDB.getOne({ user_id: userId, user_status: cart_status_enum_1.cart_status.ACTIVE });
            if (!activeCart) {
                throw new Error("no cart found");
            }
            let cartItems = yield this.cartItemDB.get({ cart_id: activeCart === null || activeCart === void 0 ? void 0 : activeCart.id });
            let productsInCartItems = yield this.productDB.comparisonSearch({ _in: { id: cartItems.map(item => item.product_id) } });
            let cartProducts = yield this.productlogic.convertProductsToProductResponsesEfficient(productsInCartItems);
            let cartItemResponses = cartItems.map((cartItem) => {
                let product = cartProducts.find((prod) => prod.id === cartItem.product_id);
                let cartItemResponse = new product_cart_response_1.CartItemResponse(cartItem); //convert cartItem to CartItemResponse to enrich it with all its fields
                cartItemResponse.product = product;
                cartItemResponse.updateCartItemStatus();
                return cartItemResponse;
            });
            const response = Object.assign(Object.assign({}, activeCart), { cart_items: cartItemResponses });
            // save the  CartResponse to redis server for efficiency sake, incase this endpoint is called again,  it does not hit the DB.
            yield this.cartCache.setCartResponse(userId, response);
            return response;
        });
        this.addItemToCart = (req) => __awaiter(this, void 0, void 0, function* () {
            let user = yield this.userDB.get({ id: req.user_id });
            if (!user.length)
                throw new Error("User does not exist");
            let product = yield this.productDB.getOne({ id: req.product_id });
            if (!product)
                throw new Error("Product does not exist");
            let productInventory = yield this.inventoryDB.getOne({ id: product.inventory_id });
            if (!productInventory)
                throw new Error("Product inventory not found");
            let cart = yield this.cartDB.getOne({ user_id: req.user_id, user_status: cart_status_enum_1.cart_status.ACTIVE });
            if (!cart) {
                let newCart = new cart_1.Cart(req.user_id, [], cart_status_enum_1.cart_status.ACTIVE);
                cart = yield this.cartDB.save(newCart);
            }
            let existingItem = yield this.cartItemDB.getOne({ cart_id: cart.id, product_id: req.product_id });
            let totalQuantity = existingItem ? existingItem.quantity + req.quantity : req.quantity;
            if (totalQuantity > productInventory.quantity_available) {
                throw new Error("Not enough inventory available");
            }
            if (existingItem) {
                yield this.cartItemDB.update({ id: existingItem.id }, { quantity: totalQuantity });
            }
            else {
                const cartItem = new cart_item_1.CartItem(cart.id, req.product_id, product.price, req.quantity);
                yield this.cartItemDB.save(cartItem);
            }
            yield this.cartCache.clearCart(req.user_id);
            const updatedCart = yield this.get(req.user_id);
            if (!updatedCart)
                throw new Error("Failed to retrieve updated cart");
            return updatedCart;
        });
        this.removeItemFromCart = (req) => __awaiter(this, void 0, void 0, function* () {
            const { userId, productId, quantity } = req;
            let user = yield this.userDB.get({ id: userId });
            if (!user.length)
                throw new Error("User does not exist");
            let cart = yield this.cartDB.getOne({ user_id: userId, user_status: cart_status_enum_1.cart_status.ACTIVE });
            if (!cart)
                throw new Error("Cart does not exist");
            let cartItem = yield this.cartItemDB.getOne({ cart_id: cart.id, product_id: productId });
            if (!cartItem)
                throw new Error("Product not found in cart");
            if (quantity !== undefined && quantity > 0) {
                if (quantity < cartItem.quantity) {
                    // reduce quantity
                    let newQuantity = cartItem.quantity - quantity;
                    yield this.cartItemDB.update({ id: cartItem.id }, { quantity: newQuantity });
                }
                else if (quantity === cartItem.quantity) {
                    // remove item completely
                    yield this.cartItemDB.remove({ id: cartItem.id });
                }
                else {
                    throw new Error("Quantity to remove exceeds quantity in cart");
                }
            }
            else {
                //  if no valid quantity is given, remove the item
                yield this.cartItemDB.remove({ id: cartItem.id });
            }
            yield this.cartCache.clearCart(userId);
            let updatedCart = yield this.get(userId);
            if (!updatedCart)
                throw new Error("Failed to retrieve updated cart");
            return updatedCart;
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
            yield this.cartCache.clearCart(cart.user_id); // Clears the redit server from serfing same cart if it was present 
            return cartToRemove;
        });
    }
}
exports.CartLogic = CartLogic;
