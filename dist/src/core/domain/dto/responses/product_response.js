"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductResponse = void 0;
const product_1 = require("../../entity/product");
class ProductResponse extends product_1.Product {
    constructor(init) {
        var _a, _b;
        super(init.name, init.price, init.category_id, init.inventory_id, init.image_url);
        this.category = null;
        this.inventory = null;
        this.id = init.id;
        this.category = (_a = init.category) !== null && _a !== void 0 ? _a : null;
        this.inventory = (_b = init.inventory) !== null && _b !== void 0 ? _b : null;
    }
}
exports.ProductResponse = ProductResponse;
