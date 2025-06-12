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
exports.CartItemController = void 0;
class CartItemController {
    constructor(cartItemLogic) {
        this.cartItemLogic = cartItemLogic;
        this.create = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                let cartItem = yield this.cartItemLogic.create(req.body);
                res.json(cartItem);
            }
            catch (ex) {
                res.json({ error: ex.message });
            }
        });
        this.remove = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(req.params.cartItemId, "this the cartitem Id");
                let remove = yield this.cartItemLogic.delete(req.params.cartItemId);
                res.status(200).json(remove);
            }
            catch (err) {
                res.status(500).json({ error: err.message });
            }
        });
    }
}
exports.CartItemController = CartItemController;
