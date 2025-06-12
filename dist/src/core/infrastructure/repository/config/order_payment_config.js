"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderPaymentConfig = void 0;
const typeorm_1 = require("typeorm");
const payment_status_enums_1 = require("../../../domain/enums/payment_status_enums");
let OrderPaymentConfig = class OrderPaymentConfig extends typeorm_1.BaseEntity {
};
exports.OrderPaymentConfig = OrderPaymentConfig;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], OrderPaymentConfig.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], OrderPaymentConfig.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], OrderPaymentConfig.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "orderid" }),
    __metadata("design:type", Number)
], OrderPaymentConfig.prototype, "orderId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "useremail" }),
    __metadata("design:type", String)
], OrderPaymentConfig.prototype, "userEmail", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], OrderPaymentConfig.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "processorreference" }),
    __metadata("design:type", String)
], OrderPaymentConfig.prototype, "processorReference", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "transactionreference" }),
    __metadata("design:type", String)
], OrderPaymentConfig.prototype, "transactionReference", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], OrderPaymentConfig.prototype, "remarks", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], OrderPaymentConfig.prototype, "deliveryamount", void 0);
exports.OrderPaymentConfig = OrderPaymentConfig = __decorate([
    (0, typeorm_1.Entity)("order_payment")
], OrderPaymentConfig);
