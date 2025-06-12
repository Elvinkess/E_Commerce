"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UploadFile {
    constructor(resource_type = "", secure_url = "", public_id = "", folder = "") {
        this.resource_type = "";
        this.secure_url = "";
        this.public_id = "";
        this.folder = "";
        this.name = "";
        this.resource_type = resource_type;
        this.secure_url = secure_url;
        this.public_id = public_id;
        this.folder = folder;
    }
}
exports.default = UploadFile;
