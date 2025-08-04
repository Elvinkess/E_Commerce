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
                res.json({ error: err.message });
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
                res.json({ error: err.message });
            }
        });
        this.search = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                let product = yield this.productLogic.search(req.body);
                res.json(product);
            }
            catch (err) {
                res.json({ error: err.message });
            }
        });
        this.getAllproduct = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                let Allproducts = yield this.productLogic.getAll();
                res.json(Allproducts);
            }
            catch (err) {
                res.json({ error: err.message });
            }
        });
    }
}
exports.ProductController = ProductController;
