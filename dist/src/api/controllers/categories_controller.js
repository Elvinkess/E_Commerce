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
exports.CategoriesController = void 0;
class CategoriesController {
    constructor(categories, product) {
        this.categories = categories;
        this.product = product;
        this.createCategories = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log({ body: req.body });
                let categories = yield this.categories.create(req.body);
                res.json(categories);
            }
            catch (ex) {
                console.log(ex);
                res.json({ error: ex.message });
            }
        });
        this.removeCategories = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                let removeCat = yield this.categories.remove(req.body);
                res.json(removeCat);
            }
            catch (ex) {
                console.log(ex);
                res.json({ error: ex.message });
            }
        });
        this.getAllCategories = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                let AllCategories = yield this.categories.getAll();
                res.json(AllCategories);
            }
            catch (ex) {
                console.log(ex);
                res.json({ error: ex.message });
            }
        });
        this.getCatproducts = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                let AllCatprodcts = yield this.categories.getCategoryproducts(req.body.id);
                res.json(AllCatprodcts);
            }
            catch (ex) {
                console.log(ex);
                res.json({ error: ex.message });
            }
        });
    }
}
exports.CategoriesController = CategoriesController;
