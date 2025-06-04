import {  Router } from "express";
import { cartLogic, userLogic } from "../program";
import { CartController } from "../controllers/cart_controller";

const cartRoute = Router();
let cartController = new CartController(cartLogic,userLogic)
cartRoute.post("/", cartController.createCart);
cartRoute.get("/getcart/:userId", cartController.getCart);
cartRoute.get("/remove/:cartId", cartController.remove);
export default cartRoute