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
exports.AuthMiddleware = void 0;
exports.authorizeRole = authorizeRole;
const user_1 = require("../../core/domain/entity/user");
function authorizeRole(roles) {
    return (req, res, next) => {
        var _a, _b;
        console.log(req.user);
        if (!req.user || !roles.includes((_b = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.role) !== null && _b !== void 0 ? _b : user_1.UserRole.EDITOR)) {
            //onsole.log("Full user object from request:", req.user);
            //console.log("User role from request:", req.user?.role as UserRole);
            console.log("Allowed roles:", roles);
            res.status(403).json({ message: "Forbidden: You don't have the required role" });
            return;
        }
        next();
    };
}
;
class AuthMiddleware {
    constructor(userlogic) {
        this.userlogic = userlogic;
        this.authenticateJWT = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const token = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
            if (!token) {
                return res.status(401).json({ message: "Access token is missing" });
            }
            try {
                const decoded = this.userlogic.decodedjwt(token);
                req.user = decoded;
                console.log(req.user);
                next();
            }
            catch (err) {
                res.status(403).json({ message: "Invalid token" });
            }
        });
    }
    authorizeRole(roles) {
        return (req, res, next) => {
            var _a;
            console.log(req.user);
            if (!req.user || !roles.includes((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.role)) {
                //onsole.log("Full user object from request:", req.user);
                //console.log("User role from request:", req.user?.role as UserRole);
                console.log("Allowed roles:", roles);
                res.status(403).json({ message: "Forbidden: You don't have the required role" });
                return;
            }
            next();
        };
    }
}
exports.AuthMiddleware = AuthMiddleware;
