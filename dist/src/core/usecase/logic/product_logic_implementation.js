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
const categories_1 = require("../../domain/entity/categories");
const inventory_1 = require("../../domain/entity/inventory");
const product_1 = require("../../domain/entity/product");
class ProductLogic {
    constructor(categoryDb, inventoryDb, productDb, fileService) {
        this.categoryDb = categoryDb;
        this.inventoryDb = inventoryDb;
        this.productDb = productDb;
        this.fileService = fileService;
        this.getAllPaginate = (page, limit) => __awaiter(this, void 0, void 0, function* () {
            const [product, total] = yield this.productDb.findPaginated(page, limit);
            const productRes = yield this.convertProductsToProductResponsesEfficient(product);
            return { products: productRes, total, page, totalPages: Math.ceil(total / limit) };
        });
        this.update = (req) => __awaiter(this, void 0, void 0, function* () {
            let product = yield this.productDb.getOne({ id: req.id });
            if (!product) {
                throw new Error("Product not found");
            }
            const updateData = {};
            let uploadedFile = null;
            if (req.name !== undefined)
                updateData.name = req.name;
            if (req.price !== undefined)
                updateData.price = req.price;
            if (req.category_id !== undefined)
                updateData.category_id = req.category_id;
            if (req.image !== undefined) {
                uploadedFile = yield this.fileService.uploadFile(req.image);
                if (uploadedFile) {
                    updateData.image_url = uploadedFile.secure_url;
                }
            }
            if (req.quantity_available !== undefined) {
                yield this.inventoryDb.update({ product_id: req.id }, { quantity_available: req.quantity_available });
            }
            // Now update product
            const updatProduct = yield this.productDb.update({ id: req.id }, updateData);
            if (updatProduct === null) {
                throw new Error("Error trying to update product");
            }
            return this.convertProductToProductResponse(updatProduct);
        });
        this.remove = (productId) => __awaiter(this, void 0, void 0, function* () {
            const product = yield this.productDb.getOne({ id: productId });
            if (!product) {
                throw new Error("Product does not exist");
            }
            yield this.productDb.remove({ id: productId });
            yield this.inventoryDb.remove({ product_id: product.id });
            return true;
        });
        this.getOne = (productId) => __awaiter(this, void 0, void 0, function* () {
            const prod = yield this.productDb.getOne({ id: productId });
            if (!prod) {
                throw new Error("Product not found");
            }
            return this.convertProductToProductResponse(prod);
        });
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
        this.createWithImage = (req) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!req.category_name) {
                throw new Error("Category Name not Provided");
            }
            // normalize category name (avoid duplicates like "Books" vs "books")
            const categoryName = req.category_name.toUpperCase();
            const productName = req.name.toUpperCase();
            // check if category exists
            let category = yield this.categoryDb.getOne({ name: categoryName });
            // create new category if isn't available
            if (!category) {
                const newCategory = new categories_1.Categories(categoryName, "Best Product", []);
                category = yield this.categoryDb.save(newCategory);
            }
            // handle image upload
            let uploadedFile = null;
            if (req.image) {
                uploadedFile = yield this.fileService.uploadFile(req.image);
            }
            // create inventory for product
            const productInventory = new inventory_1.inventory(req.quantity_available, 0, 0);
            const savedProductInventory = yield this.inventoryDb.save(productInventory);
            // create product
            const productToSave = new product_1.Product(productName, req.price, category.id, savedProductInventory.id, (_a = uploadedFile === null || uploadedFile === void 0 ? void 0 : uploadedFile.secure_url) !== null && _a !== void 0 ? _a : "");
            const savedProduct = yield this.productDb.save(productToSave);
            // link product to inventory
            savedProductInventory.product_id = savedProduct.id;
            yield this.inventoryDb.save(savedProductInventory);
            // return response
            return new product_response_1.ProductResponse(Object.assign(Object.assign({}, savedProduct), { category, inventory: savedProductInventory }));
        });
        this.getAll = () => __awaiter(this, void 0, void 0, function* () {
            let prods = yield this.productDb.getAll();
            //    return await this.convertProductsToProductResponsesEfficient(prods);
            return yield this.convertProductsToProductResponsesEfficient(prods);
        });
        this.convertProductToProductResponse = (prod) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const inventoryId = prod.inventory_id;
            const categoryId = prod.category_id;
            const categoryRes = yield this.categoryDb.getOne({ id: categoryId });
            const inventoryRes = yield this.inventoryDb.getOne({ id: inventoryId });
            const outOfStock = ((_a = inventoryRes === null || inventoryRes === void 0 ? void 0 : inventoryRes.quantity_available) !== null && _a !== void 0 ? _a : 0) < 1;
            const productResponse = new product_response_1.ProductResponse(Object.assign(Object.assign({}, prod), { inventory: inventoryRes, category: categoryRes, outOfStock: outOfStock }));
            return productResponse;
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
            var _a;
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
                const prodCategory = categoryIdSort[product.category_id];
                const prodInventory = inventoryIdSort[product.inventory_id];
                const outOfStock = ((_a = prodInventory === null || prodInventory === void 0 ? void 0 : prodInventory.quantity_available) !== null && _a !== void 0 ? _a : 0) < 1;
                const _product = new product_response_1.ProductResponse(Object.assign(Object.assign({}, product), { inventory: prodInventory, category: prodCategory, outOfStock }));
                prodsResponses.push(_product);
            }
            return prodsResponses;
        });
        this.search = (options) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            //check if the catName is not null
            // If catName is present search for all categories with matching names
            const productName = options.productName.toUpperCase();
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
                    contains: { name: productName !== null && productName !== void 0 ? productName : "" }
                });
            }
            console.log({ categories, products, options });
            //return  await this.convertProductsToProductResponsesEfficient(products);
            return yield this.convertProductsToProductResponsesEfficient(products);
        });
    }
}
exports.ProductLogic = ProductLogic;
