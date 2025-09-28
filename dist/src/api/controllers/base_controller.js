"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uploadfile_1 = __importDefault(require("../../core/domain/entity/shared/uploadfile"));
class BaseController {
    constructor() {
        this.convertReqFileToUploadFile = (req) => {
            var _a;
            try {
                return new uploadfile_1.default("", (_a = req.file) === null || _a === void 0 ? void 0 : _a.path);
            }
            catch (ex) {
                console.log(`An exception occured while converting Req file to upload file: ${ex} `);
                return null;
            }
        };
        this.convertReqFilesToUploadFiles = (req, fieldName) => {
            var _a, _b, _c;
            let uploadFiles = [];
            try {
                let files = (_a = req.files) !== null && _a !== void 0 ? _a : null;
                if (Array.isArray(files)) {
                    uploadFiles = files.map(file => new uploadfile_1.default("", file.path));
                }
                else {
                    uploadFiles = (_c = (_b = files === null || files === void 0 ? void 0 : files[fieldName]) === null || _b === void 0 ? void 0 : _b.map(file => new uploadfile_1.default("", file.path))) !== null && _c !== void 0 ? _c : [];
                }
                return uploadFiles;
            }
            catch (ex) {
                console.log(`An exception occured while converting Req files to upload files: ${ex} `);
                return uploadFiles;
            }
        };
    }
}
exports.default = BaseController;
