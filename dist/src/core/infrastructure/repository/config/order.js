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
exports.OrderConfig = void 0;
const typeorm_1 = require("typeorm");
const order_items_1 = require("../../../domain/enums/order_items");
let OrderConfig = class OrderConfig extends typeorm_1.BaseEntity {
};
exports.OrderConfig = OrderConfig;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], OrderConfig.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", nullable: true }),
    __metadata("design:type", Object)
], OrderConfig.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: true }),
    __metadata("design:type", Object)
], OrderConfig.prototype, "guest_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], OrderConfig.prototype, "total_price", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: order_items_1.OrderStatus, default: order_items_1.OrderStatus.PENDING }),
    __metadata("design:type", String)
], OrderConfig.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], OrderConfig.prototype, "created_at", void 0);
exports.OrderConfig = OrderConfig = __decorate([
    (0, typeorm_1.Entity)("orders")
], OrderConfig);
