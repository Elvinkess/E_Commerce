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
exports.DeliveryController = void 0;
class DeliveryController {
    constructor(delivery) {
        this.delivery = delivery;
        this.webhooksocket = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                let body = req.body;
                let webhook = yield this.delivery.webhookDelivery(req.params.shippingId, body);
                res.status(200).json(webhook);
            }
            catch (err) {
                res.status(500).json({ error: err.message });
            }
        });
        this.cancelDelivery = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                let canceled = yield this.delivery.cancelDelivery(req.params.shippingId);
                res.status(200).json(canceled);
            }
            catch (err) {
                res.status(500).json({ error: err.message });
            }
        });
    }
}
exports.DeliveryController = DeliveryController;
