import { Router } from "express";
import { OrderController } from "../controllers/order_controller";
import { orderLogic} from "../program";

const orderRoute = Router();
let orderController = new OrderController(orderLogic)
orderRoute.get("/order/:userId", orderController.create);
orderRoute.get("/payment/:orderId", orderController.payment);
orderRoute.get("/confirmpayment", orderController.confirmPayment);
orderRoute.delete("/remove/:orderId/user/:userId",orderController.removeOrder);
  

export default orderRoute