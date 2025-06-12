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
        this.createCart = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                let cart = yield this.cart.create(req.body);
                res.json(cart);
            }
            catch (err) {
                res.json({ error: err.message });
            }
        });
        this.getCart = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                let cart = yield this.cart.get(req.params.userId);
                res.json(cart);
            }
            catch (err) {
                res.json({ error: err.message });
            }
        });
        this.remove = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                let remove = yield this.cart.delete(req.params.cartId);
                res.status(200).json(remove);
            }
            catch (err) {
                res.status(500).json({ error: err.message });
            }
        });
    }
}
exports.CartController = CartController;
