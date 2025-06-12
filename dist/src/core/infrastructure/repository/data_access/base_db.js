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
exports.BaseDb = void 0;
const typeorm_1 = require("typeorm");
class BaseDb {
    constructor(myDataSource, entity) {
        this.get = (query) => __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findBy(query);
        });
        this.getOne = (query) => __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findOneBy(query);
        });
        this.save = (entity) => __awaiter(this, void 0, void 0, function* () {
            const savedentity = yield this.model.save(entity);
            return savedentity;
        });
        this.remove = (query) => __awaiter(this, void 0, void 0, function* () {
            const removeEnt = yield this.model.findBy(query);
            yield this.model.delete(query);
            return removeEnt[0];
        });
        this.update = (query, keyToUpdate) => __awaiter(this, void 0, void 0, function* () {
            yield this.model.update(query, keyToUpdate);
            return yield this.model.findOneBy(query);
        });
        this._comparisonSearch = (...args_1) => __awaiter(this, [...args_1], void 0, function* (query = {}, contains = {}, numberComparison = {}, _in = {}) {
            let searchQuery = {};
            for (let [key, value] of Object.entries(query)) {
                searchQuery[key] = value;
            }
            for (let [key, value] of Object.entries(contains)) {
                searchQuery[key] = (0, typeorm_1.Like)(`%${value}%`);
            }
            for (let [key, value] of Object.entries(numberComparison)) {
                if (key === "gt") {
                    searchQuery[key] = (0, typeorm_1.MoreThan)(value);
                }
                if (key === "lt") {
                    searchQuery[key] = (0, typeorm_1.LessThan)(value);
                }
                if (key === "lte") {
                    searchQuery[key] = (0, typeorm_1.LessThanOrEqual)(value);
                }
                if (key === "gte") {
                    searchQuery[key] = (0, typeorm_1.MoreThanOrEqual)(value);
                }
            }
            for (let [key, value] of Object.entries(_in)) {
                searchQuery[key] = (0, typeorm_1.In)(value);
            }
            return yield this.model.findBy(searchQuery);
        });
        this.comparisonSearch = (options) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            let searchQuery = {};
            for (let [key, value] of Object.entries((_a = options.query) !== null && _a !== void 0 ? _a : {})) {
                searchQuery[key] = value;
            }
            for (let [key, value] of Object.entries((_b = options.contains) !== null && _b !== void 0 ? _b : {})) {
                searchQuery[key] = (0, typeorm_1.ILike)(`%${value}%`);
            }
            for (let [key, value] of Object.entries((_c = options.numberComparison) !== null && _c !== void 0 ? _c : {})) {
                if (key === "gt") {
                    searchQuery[key] = (0, typeorm_1.MoreThan)(value);
                }
                if (key === "lt") {
                    searchQuery[key] = (0, typeorm_1.LessThan)(value);
                }
                if (key === "lte") {
                    searchQuery[key] = (0, typeorm_1.LessThanOrEqual)(value);
                }
                if (key === "gte") {
                    searchQuery[key] = (0, typeorm_1.MoreThanOrEqual)(value);
                }
            }
            for (let [key, value] of Object.entries((_d = options._in) !== null && _d !== void 0 ? _d : {})) {
                searchQuery[key] = (0, typeorm_1.In)(value);
            }
            return yield this.model.findBy(searchQuery);
        });
        this.model = myDataSource.getRepository(entity);
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.find();
        });
    }
}
exports.BaseDb = BaseDb;
