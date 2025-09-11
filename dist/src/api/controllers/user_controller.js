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
exports.UserController = void 0;
// uses the usecase to make appropriate calls from the client (express)
class UserController {
    constructor(userLogic) {
        this.userLogic = userLogic;
        this.createUser = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                let user = yield this.userLogic.createUser(req.body);
                res.json(user);
            }
            catch (ex) {
                res.json({ error: ex.message });
            }
        });
        this.signInUser = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                let signInUserResponse = yield this.userLogic.signInUser(req.body);
                const { token, email, username, id } = signInUserResponse;
                res.cookie("token", token, {
                    httpOnly: true, // prevents JS access
                    secure: process.env.NODE_ENV === "production", // set true if using HTTPS
                    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
                    maxAge: 60 * 60 * 1000, // 1 hour
                });
                res.json({
                    message: "Login successful",
                    user: { email, username, id },
                });
            }
            catch (ex) {
                res.status(400).json({ error: ex.message });
            }
        });
        this.decodeUser = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token;
                if (!token) {
                    res.status(401).json({ message: "Unauthorized" });
                    return;
                }
                const payload = this.userLogic.decodedjwt(token);
                res.json({ user: payload });
            }
            catch (err) {
                res.status(400).json({ error: err.message });
            }
        });
    }
}
exports.UserController = UserController;
