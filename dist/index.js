"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_route_1 = __importDefault(require("./src/api/routes/user_route"));
const categories_route_1 = __importDefault(require("./src/api/routes/categories_route"));
const product_route_1 = __importDefault(require("./src/api/routes/product_route"));
const cors_1 = __importDefault(require("cors"));
const cart_route_1 = __importDefault(require("./src/api/routes/cart_route"));
const order_route_1 = __importDefault(require("./src/api/routes/order_route"));
const delivery_route_1 = __importDefault(require("./src/api/routes/delivery_route"));
const address_route_1 = __importDefault(require("./src/api/routes/address_route"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// const express = require('express')
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: '*', // frontend URL
    credentials: true, // allow cookies
}));
app.use((0, cookie_parser_1.default)());
app.use("/user", user_route_1.default);
app.use("/categories", categories_route_1.default);
app.use("/product", product_route_1.default);
app.use("/cart", cart_route_1.default);
app.use("/order", order_route_1.default);
app.use("/delivery", delivery_route_1.default);
app.use("/address", address_route_1.default);
let port = process.env.PORT;
app.listen(port, () => {
    console.log(`Running on http://localhost:${port}`);
});
