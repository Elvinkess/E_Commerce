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
exports.DeliveryService = void 0;
class DeliveryService {
    constructor(api, shipBubble, myBaseUrl) {
        this.api = api;
        this.shipBubble = shipBubble;
        this.myBaseUrl = myBaseUrl;
        this.validateAddress = (validateAddressRequest) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            let payload = {
                name: validateAddressRequest.name,
                email: validateAddressRequest.email,
                phone: validateAddressRequest.phone,
                address: validateAddressRequest.address
            };
            let response = yield this.api.post({
                url: `${this.shipBubble.baseUrl}/shipping/address/validate`,
                header: {
                    Authorization: `Bearer ${this.shipBubble.secretKey}`,
                },
                body: payload
            });
            if (((_a = response.data) === null || _a === void 0 ? void 0 : _a.data) !== undefined) {
                let res = {
                    status: (_b = response.data) === null || _b === void 0 ? void 0 : _b.status,
                    message: (_c = response.data) === null || _c === void 0 ? void 0 : _c.message,
                    data: (_d = response.data) === null || _d === void 0 ? void 0 : _d.data
                };
                return res;
            }
            throw new Error(response.message);
        });
        this.getDeliveryCategory = (category) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            let response = yield this.api.get({
                url: `${this.shipBubble.baseUrl}/shipping/labels/categories`,
                header: {
                    Authorization: `Bearer ${this.shipBubble.secretKey}`,
                }
            });
            if (((_a = response.data) === null || _a === void 0 ? void 0 : _a.data) !== null) {
                let categories = (_b = response.data) === null || _b === void 0 ? void 0 : _b.data;
                let cat = categories === null || categories === void 0 ? void 0 : categories.find(item => item.category.includes(category));
                if (!cat) {
                    throw new Error("Category not found");
                }
                return cat;
            }
            else {
                throw new Error(response.message);
            }
        });
        this.getShippingrates = (getShippingrateRequest) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            let payload = {
                sender_address_code: getShippingrateRequest.sender_address_code,
                reciever_address_code: getShippingrateRequest.reciever_address_code,
                pickup_date: getShippingrateRequest.pickup_date,
                category_id: getShippingrateRequest.category_id,
                package_items: getShippingrateRequest.package_items,
                package_dimension: {
                    length: getShippingrateRequest.package_dimension.length,
                    width: getShippingrateRequest.package_dimension.width,
                    height: getShippingrateRequest.package_dimension.height
                },
                delivery_instructions: getShippingrateRequest.delivery_instructions
            };
            let response = yield this.api.post({
                url: `${this.shipBubble.baseUrl}/shipping/fetch_rates`,
                header: {
                    Authorization: `Bearer ${this.shipBubble.secretKey}`,
                },
                body: payload
            });
            if (response.ok) {
                return response.data;
            }
            else {
                throw new Error((_a = response.data) === null || _a === void 0 ? void 0 : _a.message);
            }
        });
        this.createShipping = (createShippingRequest) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            let payload = {
                request_token: createShippingRequest.request_token,
                service_code: createShippingRequest.service_code,
                courier_id: createShippingRequest.courier_id
            };
            let response = yield this.api.post({
                url: `${this.shipBubble.baseUrl}/shipping/labels`,
                header: {
                    Authorization: `Bearer ${this.shipBubble.secretKey}`,
                },
                body: payload
            });
            if (response.ok) {
                return response.data;
            }
            else {
                throw new Error((_a = response.data) === null || _a === void 0 ? void 0 : _a.message);
            }
        });
        this.cancelShipping = (shippingId) => __awaiter(this, void 0, void 0, function* () {
            let response = yield this.api.post({
                url: `${this.shipBubble.baseUrl}/shipping/labels/cancel/${shippingId}`,
                header: {
                    Authorization: `Bearer ${this.shipBubble.secretKey}`,
                }
            });
            if (response.ok) {
                return response.data;
            }
            else {
                throw new Error(response.message);
            }
        });
    }
}
exports.DeliveryService = DeliveryService;
