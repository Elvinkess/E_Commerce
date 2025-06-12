"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = __importDefault(require("./api/connection"));
connection_1.default.initialize()
    .then(() => {
    console.log("✅ Database connection established.");
})
    .catch((error) => {
    console.error("❌ Error connecting to database:", error);
});
