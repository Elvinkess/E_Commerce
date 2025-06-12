"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderPayment = void 0;
const my_base_entity_1 = require("./shared/my_base_entity");
class OrderPayment extends my_base_entity_1.MyBaseEntity {
    constructor(init) {
        var _a, _b, _c, _d;
        super(0);
        this.amount = init.amount,
            this.status = init.status,
            this.orderId = init.orderId,
            this.userEmail = init.userEmail,
            this.date = init.date,
            this.processorReference = (_a = init.processorReference) !== null && _a !== void 0 ? _a : "",
            this.transactionReference = (_b = init.transactionReference) !== null && _b !== void 0 ? _b : "",
            this.remarks = (_c = init.remarks) !== null && _c !== void 0 ? _c : "",
            this.deliveryamount = (_d = init.deliveryamount) !== null && _d !== void 0 ? _d : 0;
    }
}
exports.OrderPayment = OrderPayment;
