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
    constructor(cart) {
        this.cart = cart;
        this.getCart = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.query.userId ? Number(req.query.userId) : null;
                const guestId = req.query.guestId ? String(req.query.guestId) : null;
                if (!userId && !guestId) {
                    return res.status(400).json({ error: "Either userId or guestId is required" });
                }
                let cart = yield this.cart.get(userId, guestId);
                res.json(cart);
            }
            catch (err) {
                res.json({ error: err.message });
            }
        });
        this.addCartItem = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                let requestData = req.body;
                if (!requestData.user_id && !requestData.guest_id) {
                    return res.status(400).json({ error: "Either userId or guestId must be provided" });
                }
                if (!requestData.product_id) {
                    return res.status(400).json({ error: "product_id is required" });
                }
                if (!requestData.quantity || requestData.quantity < 1) {
                    return res.status(400).json({ error: "Quantity must be at least 1" });
                }
                const requestDataProcessed = Object.assign(Object.assign({}, requestData), { user_id: requestData.user_id ? Number(requestData.user_id) : null, product_id: Number(requestData.product_id) });
                let updateCart = yield this.cart.addItemToCart(requestDataProcessed);
                res.status(200).json({ message: "Item added to cart successfully", data: updateCart });
            }
            catch (err) {
                res.status(500).json({ error: err.message || "Failed to add item to cart" });
            }
        });
        this.updateCartItem = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, productId } = req.params;
                const { quantity, guestId } = req.body;
                if (!quantity || quantity < 1) {
                    return res.status(400).json({ error: "Quantity must be at least 1" });
                }
                if (!userId && !guestId) {
                    return res.status(400).json({ error: "Either userId or guestId must be provided" });
                }
                const updateCart = yield this.cart.updateCartItem({
                    userId: userId ? Number(userId) : null,
                    guestId: guestId !== null && guestId !== void 0 ? guestId : null,
                    productId: productId,
                    quantity,
                });
                res.status(200).json({ message: "Item updated successfully", data: updateCart });
            }
            catch (err) {
                res.status(500).json({ error: err.message || "Failed to update item in cart" });
            }
        });
        this.removeCartItem = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.userId ? Number(req.params.userId) : null;
                const guestId = req.body.guestId ? String(req.body.guestId) : null;
                const productId = Number(req.params.productId);
                if (!userId && !guestId) {
                    return res.status(400).json({ error: "Either userId or guestId must be provided" });
                }
                const updateCart = yield this.cart.removeItemFromCart({ userId, guestId, productId });
                res.status(200).json({ message: "Item removed from cart successfully", data: updateCart });
            }
            catch (err) {
                res.status(500).json({ error: err.message || "Failed to remove item from cart" });
            }
        });
        this.remove = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = req.params.userId ? Number(req.params.userId) : null;
                const guestId = (_a = req.query.guestId) !== null && _a !== void 0 ? _a : null;
                console.log(userId, guestId);
                if (!userId && !guestId) {
                    return res.status(400).json({ error: "Either userId or guestId must be provided" });
                }
                let remove = yield this.cart.delete(userId, guestId);
                res.status(200).json(remove);
            }
            catch (err) {
                res.status(500).json({ error: err.message });
            }
        });
        this.mergeCart = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token;
                if (!token) {
                    res.status(401).json({ message: "Unauthorized" });
                    return;
                }
                console.log("in merge controller");
                console.log((_b = req.user) === null || _b === void 0 ? void 0 : _b.id, "user id");
                const userId = Number((_c = req.user) === null || _c === void 0 ? void 0 : _c.id);
                const guestId = req.query.guestId ? String(req.query.guestId) : null;
                if (!userId || !guestId) {
                    return res.status(400).json({ error: "Both userId or guestId is required" });
                }
                let cart = yield this.cart.mergeCart(userId, guestId);
                if (!cart) {
                    return res.status(200).json({ message: "No guest cart to merge", cart: null });
                }
                console.log("merged success");
                return res.status(200).json(cart);
            }
            catch (err) {
                console.log("not merged");
                res.status(500).json({ error: err.message || "Failed to merge cart" });
            }
        });
    }
}
exports.CartController = CartController;
