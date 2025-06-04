import { Router } from "express";
import { AddressController } from "../controllers/address_controller";
import { addressLogic } from "../program";

const addressRoute = Router();
let addressController = new AddressController(addressLogic)
addressRoute.post("/", addressController.createAddress);
export default addressRoute