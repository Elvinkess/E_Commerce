import { Router } from "express";
import { DeliveryController } from "../controllers/delivery_controller";
import { deliveryLogic } from "../program";

const deliveryRoute = Router();
let deliveryController = new DeliveryController(deliveryLogic)
deliveryRoute.post("/webhook/shipbubble", deliveryController.webhooksocket);

export default deliveryRoute;