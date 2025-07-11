"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const program_1 = require("../program");
const cart_controller_1 = require("../controllers/cart_controller");
const cartRoute = (0, express_1.Router)();
let cartController = new cart_controller_1.CartController(program_1.cartLogic, program_1.userLogic);
cartRoute.post("/", cartController.createCart);
cartRoute.get("/getcart/:userId", cartController.getCart);
cartRoute.get("/remove/:cartId", cartController.remove);
exports.default = cartRoute;
