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
exports.OrderController = void 0;
class OrderController {
    constructor(order) {
        this.order = order;
        this.create = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                let order = yield this.order.get(req.params.userId);
                console.log(order);
                res.json(order);
            }
            catch (err) {
                res.json({ error: err.message });
            }
        });
        this.payment = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                let payment = yield this.order.payForOrder(req.params.orderId);
                console.log(payment);
                res.status(200).json(payment);
            }
            catch (err) {
                res.json({ error: err.message });
            }
        });
        this.removeOrder = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                let removeOrder = yield this.order.remove(req.params.orderId, req.params.userId);
                res.status(200).json(removeOrder);
            }
            catch (err) {
                res.json({ error: err.message });
            }
        });
        this.confirmPayment = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                let confirmPayment = yield this.order.processCompletedPaymentForOrder(req.query.tx_ref);
                console.log(confirmPayment);
                res.status(200).json(confirmPayment);
            }
            catch (err) {
                res.json({ error: err.message });
            }
        });
    }
}
exports.OrderController = OrderController;
