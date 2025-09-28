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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const base_controller_1 = __importDefault(require("./base_controller"));
const error_1 = require("../../core/domain/entity/shared/error");
// uses the usecase to make appropriate calls from the client (express)
class ProductController extends base_controller_1.default {
    constructor(productLogic) {
        super();
        this.productLogic = productLogic;
        this.create = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                let productResponse = yield this.productLogic.create(req.body);
                res.json(productResponse);
            }
            catch (err) {
                if (err instanceof error_1.HttpErrors) {
                    return res.status(err.statusCode).json({ error: err.message });
                }
                res.json({ error: err.message });
            }
        });
        this.getOne = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const productId = Number(req.params.productId);
                if (isNaN(productId)) {
                    res.status(400).json({ error: "Invalid product id" });
                }
                let productResponse = yield this.productLogic.getOne(productId);
                res.status(200).json({ message: "Item updated successfully", data: productResponse });
            }
            catch (err) {
                if (err instanceof error_1.HttpErrors) {
                    return res.status(err.statusCode).json({ error: err.message });
                }
                res.status(500).json({ error: err.message });
            }
        });
        this.createProductWithImage = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                let prodImg = this.convertReqFilesToUploadFiles(req, "image")[0];
                let reqBody = req.body.data;
                let createProoductBody = JSON.parse(reqBody);
                createProoductBody.image = prodImg;
                let productResponse = yield this.productLogic.createWithImage(createProoductBody);
                res.json(productResponse);
            }
            catch (err) {
                if (err instanceof error_1.HttpErrors) {
                    return res.status(err.statusCode).json({ error: err.message });
                }
                res.json({ error: err.message });
            }
        });
        this.search = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                let product = yield this.productLogic.search(req.body);
                res.json(product);
            }
            catch (err) {
                if (err instanceof error_1.HttpErrors) {
                    return res.status(err.statusCode).json({ error: err.message });
                }
                res.json({ error: err.message });
            }
        });
        this.updateProduct = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const update = req.body.update;
                let updateProduct = yield this.productLogic.update(update);
                res.json(updateProduct);
            }
            catch (err) {
                if (err instanceof error_1.HttpErrors) {
                    return res.status(err.statusCode).json({ error: err.message });
                }
                res.json({ error: err.message });
            }
        });
        this.getAllproduct = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                let Allproducts = yield this.productLogic.getAll();
                res.json(Allproducts);
            }
            catch (err) {
                if (err instanceof error_1.HttpErrors) {
                    return res.status(err.statusCode).json({ error: err.message });
                }
                res.json({ error: err.message });
            }
        });
        this.getPaginatedProducts = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const page = Number(req.query.page);
                const limit = Number(req.query.limit);
                if (isNaN(page) || isNaN(limit)) {
                    res.status(400).json({ error: "Invalid query parameters. 'page' and 'limit' must be numbers." });
                }
                const products = yield this.productLogic.getAllPaginate(page, limit);
                res.json(products);
            }
            catch (err) {
                if (err instanceof error_1.HttpErrors) {
                    return res.status(err.statusCode).json({ error: err.message });
                }
                res.json({ error: err.message });
            }
        });
        this.remove = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { productId } = req.params;
                const response = yield this.productLogic.remove(productId);
                res.json(response);
            }
            catch (err) {
                if (err instanceof error_1.HttpErrors) {
                    return res.status(err.statusCode).json({ error: err.message });
                }
                res.json({ error: err.message });
            }
        });
    }
}
exports.ProductController = ProductController;
