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
class AddressLogic {
    constructor(addressDB, deliveryService, userDB) {
        this.addressDB = addressDB;
        this.deliveryService = deliveryService;
        this.userDB = userDB;
        this.getAddress = (userId) => __awaiter(this, void 0, void 0, function* () {
            let address = yield this.addressDB.getOne({ user_id: userId });
            if (!address) {
                throw new Error("Add a Valid Address");
            }
            return address;
        });
        this.saveAddress = (address) => __awaiter(this, void 0, void 0, function* () {
            let validateReq = {
                name: address.name,
                email: address.email,
                phone: address.phone,
                address: address.address
            };
            let user = yield this.userDB.getOne({ id: address.user_id });
            if (!user) {
                throw new Error("User doesn't exist");
            }
            let validateAddress = yield this.deliveryService.validateAddress(validateReq);
            if (!validateAddress.data.address_code) {
                throw new Error("Please use a valid address");
            }
            else {
                let saveAddress = new address_1.Address(address.name, address.email, address.phone, validateAddress.data.address_code, user.id, address.address);
                return yield this.addressDB.save(saveAddress);
            }
        });
    }
}
exports.AddressLogic = AddressLogic;
