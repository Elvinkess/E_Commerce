import {  Router } from "express";
import { authmiddleware, cartLogic, userLogic } from "../program";
import { CartController } from "../controllers/cart_controller";
import { UserRole } from "../../core/domain/entity/user";

const cartRoute = Router();
let cartController = new CartController(cartLogic,userLogic)
cartRoute.get("/getcart/:userId", cartController.getCart);
cartRoute.delete("/remove/:userId", cartController.remove);
cartRoute.post("/addItem", cartController.addCartItem);
cartRoute.delete("/:userId/items/:productId",authmiddleware.authenticateJWT, authmiddleware.authorizeRole([UserRole.ADMIN,UserRole.USER]), cartController.removeCartItem);
cartRoute.patch("/:userId/items/:productId",authmiddleware.authenticateJWT, authmiddleware.authorizeRole([UserRole.ADMIN,UserRole.USER]), cartController.updateCartItem);
export default cartRoute