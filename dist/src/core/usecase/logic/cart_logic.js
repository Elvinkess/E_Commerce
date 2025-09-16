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
        this.get = (userId, guestId) => __awaiter(this, void 0, void 0, function* () {
            if (!userId && !guestId) {
                throw new Error("Either of userId or guestId must be available");
            }
            //hit the redis server to get cart before the DB
            const cachedCart = yield this.cartCache.getCartResponse(userId, guestId);
            if (cachedCart) {
                console.log("from cache");
                return cachedCart;
            }
            let activeCart = userId ? yield this.cartDB.getOne({ user_id: userId, user_status: cart_status_enum_1.cart_status.ACTIVE }) : yield this.cartDB.getOne({ guest_id: guestId, user_status: cart_status_enum_1.cart_status.ACTIVE });
            if (!activeCart) {
                throw new Error("No cart found");
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
            yield this.cartCache.setCartResponse(response, userId, guestId);
            return response;
        });
        this.addItemToCart = (req) => __awaiter(this, void 0, void 0, function* () {
            // Validation: must have either user_id or guest_id
            if (!req.user_id && !req.guest_id) {
                throw new Error("Either user_id or guest_id must be provided");
            }
            // If logged-in user, check user existence
            if (req.user_id) {
                let user = yield this.userDB.getOne({ id: req.user_id });
                if (!user)
                    throw new Error("User does not exist");
            }
            //Validate product and inventory
            let product = yield this.productDB.getOne({ id: req.product_id });
            if (!product)
                throw new Error("Product does not exist");
            let productInventory = yield this.inventoryDB.getOne({ id: product.inventory_id });
            if (!productInventory)
                throw new Error("Product inventory not found");
            // find active cart(user or guest)
            let cart = req.user_id ? yield this.cartDB.getOne({ user_id: req.user_id, user_status: cart_status_enum_1.cart_status.ACTIVE }) : yield this.cartDB.getOne({ guest_id: req.guest_id, user_status: cart_status_enum_1.cart_status.ACTIVE });
            // if no active cart create a new one
            if (!cart) {
                let newCart = new cart_1.Cart([], cart_status_enum_1.cart_status.ACTIVE, req.user_id, req.guest_id);
                cart = yield this.cartDB.save(newCart);
            }
            //check if item exist in cart
            let existingItem = yield this.cartItemDB.getOne({ cart_id: cart.id, product_id: req.product_id });
            let totalQuantity = existingItem ? existingItem.quantity + req.quantity : req.quantity;
            if (totalQuantity > productInventory.quantity_available) {
                throw new Error("Not enough inventory available");
            }
            //Add or update item
            if (existingItem) {
                yield this.cartItemDB.update({ id: existingItem.id }, { quantity: totalQuantity });
            }
            else {
                const cartItem = new cart_item_1.CartItem(cart.id, req.product_id, product.price, req.quantity);
                yield this.cartItemDB.save(cartItem);
            }
            yield this.cartCache.clearCart(req.user_id, req.guest_id);
            const updatedCart = yield this.get(req.user_id, req.guest_id);
            if (!updatedCart)
                throw new Error("Failed to retrieve updated cart");
            return updatedCart;
        });
        this.updateCartItem = (req) => __awaiter(this, void 0, void 0, function* () {
            if (!req.userId && !req.guestId) {
                throw new Error("Either of userId or guestId must be provided");
            }
            const productId = Number(req.productId);
            const cart = req.userId ? yield this.cartDB.getOne({ user_id: req.userId, user_status: cart_status_enum_1.cart_status.ACTIVE }) : yield this.cartDB.getOne({ guest_id: req.guestId, user_status: cart_status_enum_1.cart_status.ACTIVE });
            if (!cart) {
                throw new Error("cart not found");
            }
            const cartItem = yield this.cartItemDB.getOne({ cart_id: cart.id, product_id: productId });
            if (!cartItem) {
                throw new Error("cart item not found");
            }
            yield this.cartItemDB.update({ id: cartItem.id }, { quantity: req.quantity });
            yield this.cartCache.clearCart(req.userId, req.guestId);
            const updatedCart = yield this.get(req.userId, req.guestId);
            if (!updatedCart)
                throw new Error("Failed to retrieve updated cart");
            return updatedCart;
        });
        this.removeItemFromCart = (req) => __awaiter(this, void 0, void 0, function* () {
            const { userId, guestId, productId } = req;
            if (!userId && !guestId) {
                throw new Error("Either of userId or guestId must be available");
            }
            // Step 1: Get active cart for this user
            const cart = userId ? yield this.cartDB.getOne({ user_id: userId, user_status: cart_status_enum_1.cart_status.ACTIVE }) : yield this.cartDB.getOne({ guest_id: guestId, user_status: cart_status_enum_1.cart_status.ACTIVE });
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
            yield this.cartCache.clearCart(userId, guestId);
            const updatedCart = yield this.get(userId, guestId);
            if (!updatedCart)
                throw new Error("Failed to retrieve updated cart");
            return updatedCart;
        });
        this.delete = (userId, guestId) => __awaiter(this, void 0, void 0, function* () {
            if (!userId && !guestId) {
                throw new Error("Either of userId or guestId must be available");
            }
            let cart = userId ? yield this.cartDB.getOne({ user_id: userId, user_status: cart_status_enum_1.cart_status.ACTIVE }) : yield this.cartDB.getOne({ guest_id: guestId, user_status: cart_status_enum_1.cart_status.ACTIVE });
            if (!cart) {
                throw new Error("There's no active  cart to delete");
            }
            let cartToRemove = yield this.cartDB.remove({ id: cart.id });
            yield this.cartCache.clearCart(cart.user_id, guestId); // Clears the redit server from serfing same cart if it was present 
            return cartToRemove;
        });
        this.mergeCart = (userId, guestId) => __awaiter(this, void 0, void 0, function* () {
            if (!userId || !guestId) {
                throw new Error("Both userId and guestId must be available");
            }
            //Fetch guest cart
            const guestCart = yield this.cartDB.getOne({ guest_id: guestId, user_status: cart_status_enum_1.cart_status.ACTIVE });
            if (!guestCart)
                return null; // nothing to merge
            const guestCartItems = yield this.cartItemDB.get({ cart_id: guestCart.id });
            //Fetch or create user cart
            let userCart = yield this.cartDB.getOne({ user_id: userId, user_status: cart_status_enum_1.cart_status.ACTIVE });
            let userCartItems = [];
            if (!userCart) {
                const cart = new cart_1.Cart([], cart_status_enum_1.cart_status.ACTIVE, userId, null);
                userCart = yield this.cartDB.save(cart);
            }
            else {
                userCartItems = yield this.cartItemDB.get({ cart_id: userCart.id });
            }
            // Merge items
            for (const gItem of guestCartItems) {
                const existing = userCartItems.find((uItem) => uItem.product_id === gItem.product_id);
                if (existing) {
                    yield this.cartItemDB.update({ id: existing.id }, { quantity: existing.quantity + gItem.quantity });
                }
                else {
                    const newCartItem = new cart_item_1.CartItem(userCart.id, gItem.product_id, gItem.purchased_price, gItem.quantity);
                    yield this.cartItemDB.save(newCartItem);
                }
            }
            //Clear guest cart
            yield this.cartItemDB.removeMany({ cart_id: guestCart.id });
            yield this.cartDB.update({ id: guestCart.id }, { user_status: cart_status_enum_1.cart_status.INACTIVE });
            yield this.cartCache.clearCart(null, guestId);
            //Build response (same as get)
            const mergedCartItems = yield this.cartItemDB.get({ cart_id: userCart.id });
            const productsInCartItems = yield this.productDB.comparisonSearch({ _in: { id: mergedCartItems.map((item) => item.product_id) },
            });
            const cartProducts = yield this.productlogic.convertProductsToProductResponsesEfficient(productsInCartItems);
            const cartItemResponses = mergedCartItems.map((cartItem) => {
                const product = cartProducts.find((prod) => prod.id === cartItem.product_id);
                const cartItemResponse = new product_cart_response_1.CartItemResponse(cartItem);
                cartItemResponse.product = product;
                cartItemResponse.updateCartItemStatus();
                return cartItemResponse;
            });
            const response = Object.assign(Object.assign({}, userCart), { cart_items: cartItemResponses });
            // optional: cache the merged response
            yield this.cartCache.setCartResponse(response, userId, null);
            return response;
        });
    }
}
exports.CartLogic = CartLogic;
