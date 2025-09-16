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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisCartCache = void 0;
const connection_1 = __importDefault(require("../../../api/redis/connection"));
class RedisCartCache {
    constructor() {
        this.getCartResponse = (userId, guestId) => __awaiter(this, void 0, void 0, function* () {
            const data = yield connection_1.default.get(this.key(userId, guestId));
            return data ? JSON.parse(data) : null;
        });
        this.setCartResponse = (response, userId, guestId) => __awaiter(this, void 0, void 0, function* () {
            yield connection_1.default.set(this.key(userId, guestId), JSON.stringify(response), {
                EX: 60 * 60 * 24, // expire after 24 hours
            });
        });
        this.clearCart = (userId, guestId) => __awaiter(this, void 0, void 0, function* () {
            yield connection_1.default.del(this.key(userId, guestId));
        });
    }
    key(userId, guestId) {
        if (userId !== null)
            return `cart:response:user:${userId}`;
        if (guestId !== null)
            return `cart:response:guest:${guestId}`;
        throw new Error("Either userId or guestId must be provided");
    }
}
exports.RedisCartCache = RedisCartCache;
