"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const delivery_controller_1 = require("../controllers/delivery_controller");
const program_1 = require("../program");
const deliveryRoute = (0, express_1.Router)();
let deliveryController = new delivery_controller_1.DeliveryController(program_1.deliveryLogic);
deliveryRoute.post("/webhook/shipbubble", deliveryController.webhooksocket);
exports.default = deliveryRoute;
