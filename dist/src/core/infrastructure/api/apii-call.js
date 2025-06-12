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
exports.Api = void 0;
const axios_1 = __importDefault(require("axios"));
class Api {
    get(req) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                let response = yield axios_1.default.get(req.url, { headers: Object.assign({}, req.header) });
                return {
                    status: response.status,
                    data: response.data,
                    ok: true,
                    message: response.statusText
                };
            }
            catch (e) {
                let error = e;
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    return {
                        status: error.response.status,
                        data: error.response.data,
                        ok: false,
                        message: error.message
                    };
                }
                else if (error.request) {
                    console.log(error.request);
                    return {
                        status: (_a = error.status) !== null && _a !== void 0 ? _a : 500,
                        data: null,
                        ok: false,
                        message: error.message
                    };
                    // The request was made but no response was received
                    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                    // http.ClientRequest in node.js
                }
                else {
                    // Something happened in setting up the request that triggered an Error
                    return {
                        status: (_b = error.status) !== null && _b !== void 0 ? _b : 500,
                        data: null,
                        ok: false,
                        message: error.message
                    };
                }
            }
        });
    }
    post(req) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            try {
                let response = yield axios_1.default.post(req.url, req.body, { headers: Object.assign(Object.assign({}, req.header), { "Content-Type": (_b = (_a = req.header) === null || _a === void 0 ? void 0 : _a.contentType) !== null && _b !== void 0 ? _b : "application/json" }) });
                return {
                    status: response.status,
                    data: response.data,
                    ok: true,
                    message: response.statusText
                };
            }
            catch (e) {
                let error = e;
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    return {
                        status: error.response.status,
                        data: error.response.data,
                        ok: false,
                        message: error.message
                    };
                }
                else if (error.request) {
                    return {
                        status: (_c = error.status) !== null && _c !== void 0 ? _c : 500,
                        data: null,
                        ok: false,
                        message: error.message
                    };
                    // The request was made but no response was received
                    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                    // http.ClientRequest in node.js
                }
                else {
                    // Something happened in setting up the request that triggered an Error
                    return {
                        status: (_d = error.status) !== null && _d !== void 0 ? _d : 500,
                        data: null,
                        ok: false,
                        message: error.message
                    };
                }
            }
        });
    }
    put(req) {
        throw new Error("Method not implemented.");
    }
    patch(req) {
        throw new Error("Method not implemented.");
    }
    delete(req) {
        throw new Error("Method not implemented.");
    }
}
exports.Api = Api;
