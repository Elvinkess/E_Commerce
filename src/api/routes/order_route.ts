import { Router } from "express";
import { OrderController } from "../controllers/order_controller";
import { orderLogic, paymentLogic } from "../program";

const orderRoute = Router();
let orderController = new OrderController(orderLogic)
orderRoute.get("/order/:userId", orderController.create);
orderRoute.get("/payment/:orderId", orderController.payment);
orderRoute.get("/confirmpayment", orderController.confirmPayment);

export default orderRoute