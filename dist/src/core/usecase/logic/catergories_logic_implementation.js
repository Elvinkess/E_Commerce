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
exports.CategoriesLogic = void 0;
const bad_request_1 = require("../utilities/Errors/bad_request");
const not_found_request_1 = require("../utilities/Errors/not_found_request");
class CategoriesLogic {
    constructor(categoriesDb, productDb) {
        this.categoriesDb = categoriesDb;
        this.productDb = productDb;
        this.create = (categories) => __awaiter(this, void 0, void 0, function* () {
            let cat = yield this.categoriesDb.get({ name: categories.name });
            if (cat.length) {
                throw new bad_request_1.BadRequestError("Category with name exists: " + categories.name);
            }
            let category = yield this.categoriesDb.save(categories);
            return category;
        });
        this.getAll = () => __awaiter(this, void 0, void 0, function* () {
            return yield this.categoriesDb.getAll();
        });
        this.remove = (categories) => __awaiter(this, void 0, void 0, function* () {
            let cat = yield this.categoriesDb.get({ id: categories.id });
            console.log({ categories, cat });
            if (!cat || !cat.length) {
                throw new not_found_request_1.NotFoundError(`Category with id ${categories.id} does not  exists`);
            }
            return yield this.categoriesDb.remove({ id: categories.id });
        });
        this.getCategoryproducts = (categoryId) => __awaiter(this, void 0, void 0, function* () {
            // get category with id from db
            let category = yield this.categoriesDb.getOne({ id: categoryId });
            if (!category) {
                throw new not_found_request_1.NotFoundError(`Category with id ${categoryId} does not  exists`);
            }
            // if category is found 
            // get all products  having the category id 
            let products = yield this.productDb.get({ category_id: categoryId });
            category.products = products;
            return category;
            // category.products = productsResponse
            // return category
        });
    }
}
exports.CategoriesLogic = CategoriesLogic;
