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
const uploadfile_1 = __importDefault(require("../../domain/entity/shared/uploadfile"));
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const cloudinary_1 = require("cloudinary");
class CloudinaryService {
    constructor(cloudinaryConfig) {
        this.cloudinaryConfig = cloudinaryConfig;
        this.uploadFile = (file) => __awaiter(this, void 0, void 0, function* () {
            try {
                let kwargs = {};
                if (file.resource_type)
                    kwargs.resource_type = file.resource_type;
                if (file.folder)
                    kwargs.folder = file.folder;
                if (file.public_id)
                    kwargs.public_id = file.public_id;
                const response = yield cloudinary_1.v2.uploader.upload(file.secure_url, kwargs);
                this.deleteFileFromDisk(file.secure_url); // No need to await deleting, just delete
                if (response && response.public_id) {
                    return new uploadfile_1.default(response.resource_type, response.secure_url, response.public_id, response.folder);
                }
                return null;
            }
            catch (ex) {
                let errormsg = "";
                try {
                    this.deleteFileFromDisk(file.secure_url); // No need to await deleting, just delete
                    errormsg = JSON.stringify(ex);
                }
                catch (exc) {
                }
                return null;
            }
        });
        this.uploadMultipleFiles = (files) => __awaiter(this, void 0, void 0, function* () {
            let allFilesToUpload = files.map(file => this.uploadFile(file));
            let results = yield Promise.allSettled(allFilesToUpload);
            let uploadedFiles = [];
            for (let result of results) {
                if (result.status === "fulfilled" && result.value) {
                    uploadedFiles.push(result.value);
                }
                else if (result.status === "rejected") {
                }
            }
            return uploadedFiles;
        });
        this.deleteFile = (publicId) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!publicId) {
                    return;
                }
                const response = yield cloudinary_1.v2.uploader.destroy(publicId);
            }
            catch (ex) {
            }
        });
        this.deletMultipleFiles = (publicIds) => __awaiter(this, void 0, void 0, function* () {
            try {
                let allFilesToDelete = publicIds.map(id => this.deleteFile(id));
                yield Promise.allSettled(allFilesToDelete);
            }
            catch (ex) {
                return;
            }
        });
        this.deleteFileFromDisk = (url) => __awaiter(this, void 0, void 0, function* () {
            try {
                let deleted = yield fs_1.promises.unlink(path_1.default.join(process.cwd(), url));
                console.log({ deleted });
            }
            catch (ex) {
                console.error(`file in path ${url} not deleted with error: ${ex}`);
            }
        });
        cloudinary_1.v2.config({
            cloud_name: cloudinaryConfig.CLOUD_NAME,
            api_key: cloudinaryConfig.API_KEY,
            api_secret: cloudinaryConfig.API_SECRET,
            secure: true
        });
    }
}
exports.default = CloudinaryService;
