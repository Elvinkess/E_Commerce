"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Address = void 0;
const my_base_entity_1 = require("./shared/my_base_entity");
class Address extends my_base_entity_1.MyBaseEntity {
    constructor(name, email, phone, address_code, user_id, address) {
        super(0);
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.address_code = address_code;
        this.user_id = user_id;
        this.address = address;
    }
}
exports.Address = Address;
