"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const my_base_entity_1 = require("./shared/my_base_entity");
class Order extends my_base_entity_1.MyBaseEntity {
    constructor(user_id, total_price, status) {
        super(0);
        this.user_id = user_id;
        this.total_price = total_price;
        this.status = status;
    }
}
exports.Order = Order;
