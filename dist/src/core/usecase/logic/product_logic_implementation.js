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
exports.ProductLogic = void 0;
const product_response_1 = require("../../domain/dto/responses/product_response");
const inventory_1 = require("../../domain/entity/inventory");
const product_1 = require("../../domain/entity/product");
class ProductLogic {
    constructor(categoryDb, inventoryDb, productDb, fileService) {
        this.categoryDb = categoryDb;
        this.inventoryDb = inventoryDb;
        this.productDb = productDb;
        this.fileService = fileService;
        this.create = (create_product) => __awaiter(this, void 0, void 0, function* () {
            // verify category exists 
            let category = yield this.categoryDb.getOne({ id: create_product.category_id });
            if (!category) {
                throw new Error(`Category with id ${create_product.category_id} does not exist`);
            }
            // create inventory for product
            let productInventory = new inventory_1.inventory(create_product.quantity_available, 0, 0);
            let savedProductInventory = yield this.inventoryDb.save(productInventory);
            console.log(savedProductInventory.id, "inventory ID");
            // add inventory  to product
            let productToSave = new product_1.Product(create_product.name, create_product.price, category.id, savedProductInventory.id);
            let savedProduct = yield this.productDb.save(productToSave);
            savedProductInventory.product_id = savedProduct.id;
            console.log(savedProduct.id, "product ID");
            yield this.inventoryDb.save(savedProductInventory);
            // save product
            return new product_response_1.ProductResponse(Object.assign(Object.assign({}, savedProduct), { category: category, inventory: savedProductInventory }));
            // return saved product
        });
        this.createWithImage = (create_product) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            // verify category exists 
            console.log("Here wqith image");
            let category = yield this.categoryDb.getOne({ id: create_product.category_id });
            if (!category) {
                throw new Error(`Category with id ${create_product.category_id} does not exist`);
            }
            let uploadedFile = null;
            if (create_product.image) {
                //
                console.log("Image found");
                uploadedFile = yield this.fileService.uploadFile(create_product.image);
                console.log({ uploadedFile });
            }
            // create inventory for product
            let productInventory = new inventory_1.inventory(create_product.quantity_available, 0, 0);
            let savedProductInventory = yield this.inventoryDb.save(productInventory);
            console.log({ savedProductInventory });
            // add inventory  to product
            let productToSave = new product_1.Product(create_product.name, create_product.price, category.id, savedProductInventory.id, (_a = uploadedFile === null || uploadedFile === void 0 ? void 0 : uploadedFile.secure_url) !== null && _a !== void 0 ? _a : "");
            let savedProduct = yield this.productDb.save(productToSave);
            savedProductInventory.product_id = savedProduct.id;
            yield this.inventoryDb.save(savedProductInventory);
            // save product
            return new product_response_1.ProductResponse(Object.assign(Object.assign({}, savedProduct), { category: category, inventory: savedProductInventory }));
            // return saved product
        });
        this.getAll = () => __awaiter(this, void 0, void 0, function* () {
            let prods = yield this.productDb.getAll();
            //    return await this.convertProductsToProductResponsesEfficient(prods);
            return yield this.convertProductsToProductResponsesEfficient(prods);
        });
        this.convertProductsToProductResponses = (prods) => __awaiter(this, void 0, void 0, function* () {
            let prodsResponses = [];
            for (let i = 0; i < prods.length - 1; i++) {
                let inventoryId = prods[i].inventory_id;
                let categoryId = prods[i].category_id;
                let categoryRes = yield this.categoryDb.getOne({ id: categoryId });
                let inventoryRes = yield this.inventoryDb.getOne({ id: inventoryId });
                let product = new product_response_1.ProductResponse(Object.assign(Object.assign({}, prods[i]), { inventory: inventoryRes, category: categoryRes }));
                prodsResponses.push(product);
            }
            return prodsResponses;
        });
        this.convertProductsToProductResponsesEfficient = (prods) => __awaiter(this, void 0, void 0, function* () {
            let prodsResponses = [];
            let inventoryIds = prods.map(prod => prod.inventory_id); // 1, 2
            let categoriesIds = prods.map(prod => prod.category_id);
            let inventories = yield this.inventoryDb.comparisonSearch({ _in: { id: inventoryIds } }); // [{id: 1}, {id: 2}]
            let categories = yield this.categoryDb.comparisonSearch({ _in: { id: categoriesIds } });
            let inventoryIdSort = {};
            for (let inventory of inventories) {
                inventoryIdSort[inventory.id] = inventory; //{1:inventory1,2:inventory2}
            }
            let categoryIdSort = {};
            for (let category of categories) {
                categoryIdSort[category.id] = category;
            }
            for (let product of prods) {
                let prodCategory = categoryIdSort[product.category_id];
                let prodInventory = inventoryIdSort[product.inventory_id];
                let _product = new product_response_1.ProductResponse(Object.assign(Object.assign({}, product), { inventory: prodInventory, category: prodCategory }));
                prodsResponses.push(_product);
            }
            return prodsResponses;
        });
        this.search = (options) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            //check if the catName is not null
            // If catName is present search for all categories with matching names
            let categories = [];
            let products = [];
            if (options.catName) {
                categories = yield this.categoryDb.comparisonSearch({ contains: { name: options.catName } });
            }
            // if there are categories found, search for products only within these categories
            if (categories.length !== 0) {
                products = yield this.productDb.comparisonSearch({
                    _in: { category_id: categories.map(category => category.id) },
                    contains: { name: (_a = options.productName) !== null && _a !== void 0 ? _a : "" }
                });
            }
            else if (categories.length === 0) {
                products = yield this.productDb.comparisonSearch({
                    contains: { name: (_b = options.productName) !== null && _b !== void 0 ? _b : "" }
                });
            }
            console.log({ categories, products, options });
            //return  await this.convertProductsToProductResponsesEfficient(products);
            return yield this.convertProductsToProductResponsesEfficient(products);
        });
    }
}
exports.ProductLogic = ProductLogic;
