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
exports.AddressController = void 0;
class AddressController {
    constructor(address) {
        this.address = address;
        this.createAddress = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                let address = yield this.address.saveAddress(req.body);
                res.json(address);
            }
            catch (err) {
                res.json({ error: err.message });
            }
        });
        this.getAddress = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.query;
                const id = Number(userId);
                const address = yield this.address.getAddress(id);
                res.status(200).json(address);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
}
exports.AddressController = AddressController;
