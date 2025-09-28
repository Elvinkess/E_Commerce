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
const error_1 = require("../../core/domain/entity/shared/error");
class OrderController {
    constructor(order) {
        this.order = order;
        this.create = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.userId ? Number(req.params.userId) : null;
                const guestId = req.query.guestId ? String(req.query.guestId) : null;
                if (!userId && !guestId) {
                    return res.status(400).json({ error: "Either userId or guestId is required" });
                }
                let order = yield this.order.get(userId, guestId);
                console.log(order);
                res.json(order);
            }
            catch (err) {
                if (err instanceof error_1.HttpErrors) {
                    return res.status(err.statusCode).json({ error: err.message });
                }
                res.status(500).json({ error: err.message });
            }
        });
        this.getorderHistory = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                let order = yield this.order.getOrderHistory(req.params.userId);
                res.json(order);
            }
            catch (err) {
                if (err instanceof error_1.HttpErrors) {
                    return res.status(err.statusCode).json({ error: err.message });
                }
                res.status(500).json({ error: err.message });
            }
        });
        this.payment = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const orderId = Number(req.params.orderId);
                if (isNaN(orderId)) {
                    return res.status(400).json({ error: "Invalid orderId" });
                }
                const email = req.body.email;
                let payment = yield this.order.payForOrder(orderId, email);
                console.log(payment);
                res.status(200).json(payment);
            }
            catch (err) {
                if (err instanceof error_1.HttpErrors) {
                    return res.status(err.statusCode).json({ error: err.message });
                }
                res.status(500).json({ error: err.message });
            }
        });
        this.removeOrder = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const orderId = Number(req.params.orderId);
                if (isNaN(orderId)) {
                    return res.status(400).json({ error: "Invalid orderId" });
                }
                const userId = req.query.userId ? Number(req.query.userId) : null;
                const guestId = req.query.guestId ? String(req.query.guestId) : null;
                if (!userId && !guestId) {
                    return res.status(400).json({ error: "Either userId or guestId is required" });
                }
                let removeOrder = yield this.order.remove(orderId, userId, guestId);
                res.status(200).json(removeOrder);
            }
            catch (err) {
                if (err instanceof error_1.HttpErrors) {
                    return res.status(err.statusCode).json({ error: err.message });
                }
                res.status(500).json({ error: err.message });
            }
        });
        this.confirmPayment = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                let confirmPayment = yield this.order.processCompletedPaymentForOrder(req.query.tx_ref);
                console.log(confirmPayment);
                res.status(200).json(confirmPayment);
            }
            catch (err) {
                if (err instanceof error_1.HttpErrors) {
                    return res.status(err.statusCode).json({ error: err.message });
                }
                res.status(500).json({ error: err.message });
            }
        });
    }
}
exports.OrderController = OrderController;
