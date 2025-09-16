import {  Router } from "express";
import { authmiddleware, cartLogic} from "../program";
import { CartController } from "../controllers/cart_controller";
import { UserRole } from "../../core/domain/entity/user";

const cartRoute = Router();
let cartController = new CartController(cartLogic)
cartRoute.get("/getcart", cartController.getCart);
cartRoute.get("/merge",authmiddleware.authenticateJWT, authmiddleware.authorizeRole([UserRole.ADMIN,UserRole.USER]), cartController.mergeCart);
cartRoute.delete("/remove/:userId", cartController.remove);//for users to delete a cart
cartRoute.delete("/clear/guest", cartController.remove);//  for guest to delete a cart
cartRoute.post("/addItem", cartController.addCartItem);// for all
cartRoute.delete("/:userId/items/:productId",authmiddleware.authenticateJWT, authmiddleware.authorizeRole([UserRole.ADMIN,UserRole.USER]), cartController.removeCartItem);// for user to delete cart item
cartRoute.delete("/guest/item/:productId", cartController.removeCartItem);//for guest to delete cart item
cartRoute.patch("/:userId/items/:productId",authmiddleware.authenticateJWT, authmiddleware.authorizeRole([UserRole.ADMIN,UserRole.USER]), cartController.updateCartItem);// for users update cart item
cartRoute.patch( "/guest/item/:productId",cartController.updateCartItem); // for guest update cart item
  
export default cartRoute