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
exports.Paymentlogic = void 0;
class Paymentlogic {
    constructor(orderDB, userDB, orderPaymentDB, paymentService, deliveryDB, cardDB, inventoryDB, orderItemDB, productDB, deliveryLogic) {
        this.orderDB = orderDB;
        this.userDB = userDB;
        this.orderPaymentDB = orderPaymentDB;
        this.paymentService = paymentService;
        this.deliveryDB = deliveryDB;
        this.cardDB = cardDB;
        this.inventoryDB = inventoryDB;
        this.orderItemDB = orderItemDB;
        this.productDB = productDB;
        this.deliveryLogic = deliveryLogic;
        this.initiatePayforOrder = (payment) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            let savedPaymentOrder = (_a = yield this.orderPaymentDB.getOne({ id: payment.id })) !== null && _a !== void 0 ? _a : yield this.orderPaymentDB.save(payment);
            let initiatedPayment = yield this.paymentService.initiatePayment(savedPaymentOrder);
            return initiatedPayment;
        });
        this.confirmPayment = (transactionRef, totalAmount) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            let confirmPayment = yield this.paymentService.confirmPayment(transactionRef);
            console.log(confirmPayment, "this is the confirmpayment");
            if (confirmPayment === null) {
                throw new Error();
            }
            else if (confirmPayment.status !== "success") {
                throw new Error(confirmPayment.message);
            }
            else if (totalAmount !== ((_a = confirmPayment.data) === null || _a === void 0 ? void 0 : _a.amount)) {
                throw new Error("you paid: " + ((_b = confirmPayment.data) === null || _b === void 0 ? void 0 : _b.amount) + " instead of :" + totalAmount);
            }
            else if (((_c = confirmPayment.data) === null || _c === void 0 ? void 0 : _c.currency) !== "NGN") {
                throw new Error("The currency you paid with isn't NGN");
            }
            else if (confirmPayment.data.status === "successful") {
                return confirmPayment.data;
            }
            else
                throw new Error("Payment not successful");
        });
    }
}
exports.Paymentlogic = Paymentlogic;
