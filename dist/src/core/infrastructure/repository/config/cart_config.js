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
exports.CartConfig = void 0;
const typeorm_1 = require("typeorm");
const cart_status_enum_1 = require("../../../domain/enums/cart_status_enum");
let CartConfig = class CartConfig extends typeorm_1.BaseEntity {
};
exports.CartConfig = CartConfig;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], CartConfig.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], CartConfig.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { array: true }),
    __metadata("design:type", Array)
], CartConfig.prototype, "cart_item_ids", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: cart_status_enum_1.cart_status,
        default: cart_status_enum_1.cart_status.PENDING, // Default role is "user"
    }),
    __metadata("design:type", String)
], CartConfig.prototype, "user_status", void 0);
exports.CartConfig = CartConfig = __decorate([
    (0, typeorm_1.Entity)("cart")
], CartConfig);
