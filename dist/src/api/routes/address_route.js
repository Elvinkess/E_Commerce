"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const address_controller_1 = require("../controllers/address_controller");
const program_1 = require("../program");
const addressRoute = (0, express_1.Router)();
let addressController = new address_controller_1.AddressController(program_1.addressLogic);
addressRoute.post("/", addressController.createAddress);
exports.default = addressRoute;
