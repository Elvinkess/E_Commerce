import { Router } from "express";
import { OrderController } from "../controllers/order_controller";
import { orderLogic} from "../program";

const orderRoute = Router();
let orderController = new OrderController(orderLogic)
orderRoute.post("/:userId?", orderController.create);
orderRoute.get("/history/:userId", orderController.getorderHistory);
orderRoute.post("/pay/:orderId/payment", orderController.payment);
orderRoute.get("/confirmpayment", orderController.confirmPayment);
orderRoute.delete("/remove/:orderId", orderController.removeOrder);
  

export default orderRoute