"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryLogic = void 0;
const program_1 = require("../../../api/program");
const delivery_1 = require("../../domain/entity/delivery");
const order_items_1 = require("../../domain/enums/order_items");
const bad_request_1 = require("../utilities/Errors/bad_request");
const not_found_request_1 = require("../utilities/Errors/not_found_request");
class DeliveryLogic {
    constructor(deliveryService, userDB, addressDB, deliveryDb, productDB) {
        this.deliveryService = deliveryService;
        this.userDB = userDB;
        this.addressDB = addressDB;
        this.deliveryDb = deliveryDb;
        this.productDB = productDB;
        this.createDelivery = (createDeliveryRequest) => __awaiter(this, void 0, void 0, function* () {
            let order = createDeliveryRequest.orderDetails;
            if (!order) {
                throw new not_found_request_1.NotFoundError("ORDER not found!!");
            }
            if (order.status === order_items_1.OrderStatus.DELIVERED) {
                throw new bad_request_1.BadRequestError("Order has already been delivered");
            }
            let user = yield this.userDB.getOne({ id: order.user_id });
            if (!user) {
                throw new not_found_request_1.NotFoundError("USER not found!!");
            }
            let address = yield this.addressDB.getOne({ user_id: user === null || user === void 0 ? void 0 : user.id });
            if (!address) {
                throw new bad_request_1.BadRequestError("Please add an  address");
            }
            let shippingRate = yield this.getDeliveryFee(createDeliveryRequest);
            //  Variables needed to create a shipment most gotten from the shippingrate response
            let shippingRequest = {
                request_token: shippingRate.data.request_token,
                service_code: shippingRate.data.fastest_courier.service_code,
                courier_id: shippingRate.data.fastest_courier.courier_id
            };
            // Creating a shipment 
            let shipping = yield this.deliveryService.createShipping(shippingRequest);
            let date = new Date();
            let deliveryData = new delivery_1.DeliveryData(order.id, user.id, address.address_code, shipping.data.tracking_url, delivery_1.delivery_status.PENDING, date, shipping.data.order_id);
            yield this.deliveryDb.save(deliveryData);
            return shipping;
        });
        this.getDeliveryDate = (order) => __awaiter(this, void 0, void 0, function* () {
            let date = new Date();
            let deliveryDate = date.getDate() + 7;
            let dat = new Date(date.setDate(deliveryDate));
            let pad = (n) => n.toString().padStart(2, '0');
            let year = date.getFullYear();
            let month = pad(date.getMonth() + 1); // getMonth() is 0-indexed
            let day = pad(date.getDate());
            let formattedDate = `${year}-${month}-${day}`;
            return formattedDate;
            // Create a Date object
            // Helper to pad single-digit numbers with a leading zero
            // Extract and format components
        });
        this.cancelDelivery = (shippingId) => __awaiter(this, void 0, void 0, function* () {
            let shipping = yield this.deliveryDb.getOne({ shippingid: shippingId });
            if (!shipping) {
                throw new bad_request_1.BadRequestError(` There is no shpping with this ID: ${shippingId}`);
            }
            let cancelshipping = yield this.deliveryService.cancelShipping(shipping.shippingid);
            yield this.deliveryDb.update({ id: shipping.id }, { status: delivery_1.delivery_status.CANCELLED });
            return cancelshipping;
        });
        this.webhookDelivery = (shippingId, body) => __awaiter(this, void 0, void 0, function* () {
            if (body.event === "shipment.status.changed") {
                yield this.deliveryDb.update({ shippingid: shippingId }, { status: body.package_status[body.package_status.length - 1].status });
            }
            if (body.event === "shipment.cancelled") {
                yield this.deliveryDb.update({ shippingid: shippingId }, { status: body.package_status[body.package_status.length - 1].status });
            }
            return body;
            //get the event that wa  sent from the webhook response
            //if webhook rsponse shipment.status.changed 
            //get the new status and update the status in my db
        });
        this.getDeliveryFee = (createDeliveryRequest) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            let order = createDeliveryRequest.orderDetails;
            if (!order) {
                throw new not_found_request_1.NotFoundError("ORDER not found!!");
            }
            if (order.status === order_items_1.OrderStatus.DELIVERED) {
                throw new bad_request_1.BadRequestError("Order has already been delivered");
            }
            let user = yield this.userDB.getOne({ id: order.user_id });
            if (!user) {
                throw new not_found_request_1.NotFoundError("USER not found!!");
            }
            let address = yield this.addressDB.getOne({ user_id: user === null || user === void 0 ? void 0 : user.id });
            if (!address) {
                throw new bad_request_1.BadRequestError("Please add  an  address");
            }
            let orderCat = (_b = (_a = order.Order_items[0].product) === null || _a === void 0 ? void 0 : _a.category) === null || _b === void 0 ? void 0 : _b.name;
            //get  category id to identify the type of order for the delivery service
            let catId = yield this.deliveryService.getDeliveryCategory(orderCat !== null && orderCat !== void 0 ? orderCat : "Light weight items");
            // a list of items to be delivered by the delivery service 
            let packageItems = [];
            for (let i = 0; i < order.Order_items.length; i++) {
                let product = yield this.productDB.getOne({ id: order.Order_items[i].product_id });
                let item = {
                    name: (_c = product === null || product === void 0 ? void 0 : product.name) !== null && _c !== void 0 ? _c : "",
                    description: "best product",
                    unit_weight: 1,
                    unit_amount: order.Order_items[i].price,
                    quantity: order.Order_items[i].quantity
                };
                packageItems.push(item);
            }
            // the whole package item deimension
            let packageDimension = {
                length: 12,
                width: 12,
                height: 12
            };
            let rateReq = {
                sender_address_code: program_1.storeAddressCode.senderAddress,
                reciever_address_code: address.address_code,
                pickup_date: createDeliveryRequest.pickUpDate,
                category_id: catId.category_id,
                package_items: packageItems,
                package_dimension: packageDimension,
                delivery_instructions: createDeliveryRequest.deliveryInstructions
            };
            let shippingRate = yield this.deliveryService.getShippingrates(rateReq);
            return shippingRate;
        });
    }
}
exports.DeliveryLogic = DeliveryLogic;
