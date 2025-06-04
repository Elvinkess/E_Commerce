import { Router } from "express";
import { cartitemLogic} from "../program";
import { CartItemController } from "../controllers/cart_item_controller";

const cartItemRoute = Router();
let cartItemController = new CartItemController(cartitemLogic)
cartItemRoute.post("/", cartItemController.create);
cartItemRoute.get("/remove/:cartItemId", cartItemController.remove);
export default cartItemRoute