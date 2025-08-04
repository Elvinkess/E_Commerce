import {  Router } from "express";
import { cartLogic, userLogic } from "../program";
import { CartController } from "../controllers/cart_controller";

const cartRoute = Router();
let cartController = new CartController(cartLogic,userLogic)
cartRoute.get("/getcart/:userId", cartController.getCart);
cartRoute.delete("/remove/:cartId", cartController.remove);
cartRoute.post("/addItem", cartController.addCartItem);
cartRoute.post("/removeItem", cartController.removeCartItem);
export default cartRoute