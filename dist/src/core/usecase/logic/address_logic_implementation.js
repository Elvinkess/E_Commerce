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
exports.AddressLogic = void 0;
const address_1 = require("../../domain/entity/address");
const bad_request_1 = require("../utilities/Errors/bad_request");
class AddressLogic {
    constructor(addressDB, deliveryService, userDB) {
        this.addressDB = addressDB;
        this.deliveryService = deliveryService;
        this.userDB = userDB;
        this.getAddress = (userId) => __awaiter(this, void 0, void 0, function* () {
            let address = yield this.addressDB.getOne({ user_id: userId });
            if (!address) {
                throw new bad_request_1.BadRequestError("Add a Valid Address");
            }
            return address;
        });
        this.saveAddress = (address) => __awaiter(this, void 0, void 0, function* () {
            let validateReq = {
                name: address.name,
                email: address.email,
                phone: address.phone,
                address: address.address,
            };
            const user = address.user_id ? yield this.userDB.getOne({ id: address.user_id }) : null;
            if (!user && !address.guest_id) {
                throw new bad_request_1.BadRequestError("Address must be associated with either a valid user or a guest");
            }
            let validateAddress = yield this.deliveryService.validateAddress(validateReq);
            if (!validateAddress.data.address_code) {
                throw new bad_request_1.BadRequestError("Please use a valid address");
            }
            else {
                let saveAddress = new address_1.Address(address.name, address.email, address.phone, validateAddress.data.address_code, address.user_id, address.guest_id, address.address);
                return yield this.addressDB.save(saveAddress);
            }
        });
    }
}
exports.AddressLogic = AddressLogic;
