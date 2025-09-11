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
        this.updateCartItem = (req) => __awaiter(this, void 0, void 0, function* () {
            const userId = Number(req.userId);
            const productId = Number(req.productId);
            const cart = yield this.cartDB.getOne({ user_id: userId, user_status: cart_status_enum_1.cart_status.ACTIVE });
            if (!cart) {
                throw new Error("cart not found");
            }
            const cartItem = yield this.cartItemDB.getOne({ cart_id: cart.id, product_id: productId });
            if (!cartItem) {
                throw new Error("cart item not found");
            }
            yield this.cartItemDB.update({ id: cartItem.id }, { quantity: req.quantity });
            yield this.cartCache.clearCart(userId);
            const updatedCart = yield this.get(userId);
            if (!updatedCart)
                throw new Error("Failed to retrieve updated cart");
            return updatedCart;
        });
        this.removeItemFromCart = (req) => __awaiter(this, void 0, void 0, function* () {
            const { userId, productId } = req;
            // Step 1: Get active cart for this user
            const cart = yield this.cartDB.getOne({
                user_id: userId,
                user_status: cart_status_enum_1.cart_status.ACTIVE
            });
            if (!cart)
                throw new Error("Cart does not exist");
            // Step 2: Check if product is in cart
            const cartItem = yield this.cartItemDB.getOne({
                cart_id: cart.id,
                product_id: productId
            });
            if (!cartItem)
                throw new Error("Product not found in cart");
            // Step 3: Remove item completely
            yield this.cartItemDB.remove({ id: cartItem.id });
            // Step 4: Clear cache and return updated cart
            yield this.cartCache.clearCart(userId);
            const updatedCart = yield this.get(userId);
            if (!updatedCart)
                throw new Error("Failed to retrieve updated cart");
            return updatedCart;
        });
        this.delete = (userId) => __awaiter(this, void 0, void 0, function* () {
            let cart = yield this.cartDB.getOne({ user_id: userId, user_status: cart_status_enum_1.cart_status.ACTIVE });
            if (!cart) {
                throw new Error("There's no active  cart");
            }
            let cartToRemove = yield this.cartDB.remove({ id: cart.id });
            yield this.cartCache.clearCart(cart.user_id); // Clears the redit server from serfing same cart if it was present 
            return cartToRemove;
        });
    }
}
exports.CartLogic = CartLogic;
