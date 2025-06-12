"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RandomUtility = void 0;
class RandomUtility {
    static generateRandomString(size) {
        let chars = "qwertyuiopasdfghjklzxcvbnm";
        let response = "";
        for (let i = 0; i < size; i++) {
            response += chars[Math.floor(Math.random() * chars.length)];
        }
        return response;
    }
}
exports.RandomUtility = RandomUtility;
