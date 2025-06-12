"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryData = exports.delivery_status = void 0;
const my_base_entity_1 = require("./shared/my_base_entity");
var delivery_status;
(function (delivery_status) {
    delivery_status["PENDING"] = "pending";
    delivery_status["IN_TRANSIT"] = "in_transit";
    delivery_status["DELIVERED"] = "delivered";
    delivery_status["RETURNED"] = "returned";
    delivery_status["ARRIVED_FOR_PICKUP"] = "arrived for pickup";
    delivery_status["CANCELLED"] = "cancelled";
    delivery_status["REJECTED"] = "rejected";
    delivery_status["PAID"] = "paid";
})(delivery_status || (exports.delivery_status = delivery_status = {}));
class DeliveryData extends my_base_entity_1.MyBaseEntity {
    constructor(orderid, userid, addressid, trackingurl, status, date, shippingid) {
        super(0);
        this.orderid = orderid;
        this.userid = userid;
        this.addressid = addressid;
        this.trackingurl = trackingurl;
        this.status = status;
        this.date = date;
        this.shippingid = shippingid;
    }
}
exports.DeliveryData = DeliveryData;
