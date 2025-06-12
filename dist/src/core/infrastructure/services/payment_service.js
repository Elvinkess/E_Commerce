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
exports.FlwPaymentService = void 0;
const content_type_1 = require("../../domain/enums/content_type");
class FlwPaymentService {
    constructor(api, flwconfig) {
        this.api = api;
        this.flwconfig = flwconfig;
        this.initiatePayment = (orderPayment) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            let flwPaymentReq = {
                tx_ref: orderPayment.transactionReference,
                amount: (orderPayment.amount + orderPayment.deliveryamount).toString(),
                currency: "NGN",
                payment_options: 'card, ussd, banktransfer, mobilemoneyghana',
                redirect_url: this.flwconfig.redirectUrl,
                customer: {
                    email: orderPayment.userEmail,
                    name: orderPayment.userEmail
                },
                customization: {
                    title: "Our Payment platform"
                }
            };
            let _response = yield this.api.post({
                url: `${this.flwconfig.baseUrl}/payments`,
                header: {
                    Authorization: `Bearer ${this.flwconfig.secretKey}`,
                    contentType: content_type_1.contentType.applicationJson,
                },
                body: flwPaymentReq
            });
            if (_response.ok) {
                let payment = orderPayment;
                let response = _response.data;
                payment.redirectUrl = (_b = (_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.link) !== null && _b !== void 0 ? _b : "";
                return payment;
            }
            throw new Error(_response.message);
        });
        this.confirmPayment = (transactionRef) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            let options = {
                url: `${this.flwconfig.baseUrl}/transactions/verify_by_reference?tx_ref=${transactionRef}`,
                header: {
                    Authorization: `Bearer ${this.flwconfig.secretKey}`,
                    contentType: content_type_1.contentType.applicationJson,
                    accept: 'application/json'
                }
            };
            let _response = yield this.api.get(options);
            if (_response.ok) {
                let response = _response.data;
                return response;
            }
            else {
                let response = _response.data;
                throw new Error((_a = response === null || response === void 0 ? void 0 : response.message) !== null && _a !== void 0 ? _a : _response.message);
            }
        });
    }
}
exports.FlwPaymentService = FlwPaymentService;
