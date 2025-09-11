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
exports.CartController = void 0;
class CartController {
    constructor(cart, user) {
        this.cart = cart;
        this.getCart = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                let cart = yield this.cart.get(req.params.userId);
                res.json(cart);
            }
            catch (err) {
                res.json({ error: err.message });
            }
        });
        this.addCartItem = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                let requestData = req.body;
                let updateCart = yield this.cart.addItemToCart(requestData);
                res.status(200).json({ message: "Item added to cart successfully", data: updateCart });
            }
            catch (err) {
                res.status(500).json({ error: err.message || "Failed to add item to cart" });
            }
        });
        this.updateCartItem = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, productId } = req.params;
                const quantity = req.body.quantity;
                if (!quantity || quantity < 1) {
                    res.status(400).json({ error: "Quantity must be at least 1" });
                }
                let updateCart = yield this.cart.updateCartItem({ userId, productId, quantity });
                res.status(200).json({ message: "Item updated successfully", data: updateCart });
            }
            catch (err) {
                res.status(500).json({ error: err.message || "Failed to update item in cart" });
            }
        });
        this.removeCartItem = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = Number(req.params.userId);
                const productId = Number(req.params.productId);
                let updateCart = yield this.cart.removeItemFromCart({ userId, productId });
                res.status(200).json({ message: "Item removed from cart successfully", data: updateCart });
            }
            catch (err) {
                res.status(500).json({ error: err.message || "Failed to remove item from cart" });
            }
        });
        this.remove = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                let remove = yield this.cart.delete(req.params.userId);
                res.status(200).json(remove);
            }
            catch (err) {
                res.status(500).json({ error: err.message });
            }
        });
    }
}
exports.CartController = CartController;
