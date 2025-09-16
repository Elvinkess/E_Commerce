"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const program_1 = require("../program");
const cart_controller_1 = require("../controllers/cart_controller");
const user_1 = require("../../core/domain/entity/user");
const cartRoute = (0, express_1.Router)();
let cartController = new cart_controller_1.CartController(program_1.cartLogic);
cartRoute.get("/getcart", cartController.getCart);
cartRoute.get("/merge", program_1.authmiddleware.authenticateJWT, program_1.authmiddleware.authorizeRole([user_1.UserRole.ADMIN, user_1.UserRole.USER]), cartController.mergeCart);
cartRoute.delete("/remove/:userId", cartController.remove); //for users to delete a cart
cartRoute.delete("/clear/guest", cartController.remove); //  for guest to delete a cart
cartRoute.post("/addItem", cartController.addCartItem); // for all
cartRoute.delete("/:userId/items/:productId", program_1.authmiddleware.authenticateJWT, program_1.authmiddleware.authorizeRole([user_1.UserRole.ADMIN, user_1.UserRole.USER]), cartController.removeCartItem); // for user to delete cart item
cartRoute.delete("/guest/item/:productId", cartController.removeCartItem); //for guest to delete cart item
cartRoute.patch("/:userId/items/:productId", program_1.authmiddleware.authenticateJWT, program_1.authmiddleware.authorizeRole([user_1.UserRole.ADMIN, user_1.UserRole.USER]), cartController.updateCartItem); // for users update cart item
cartRoute.patch("/guest/item/:productId", cartController.updateCartItem); // for guest update cart item
exports.default = cartRoute;
