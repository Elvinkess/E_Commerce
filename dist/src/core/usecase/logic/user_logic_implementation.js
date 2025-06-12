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
exports.UserLogic = void 0;
const crypto_1 = require("crypto");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class UserLogic {
    constructor(userDb) {
        this.userDb = userDb;
        this.createUser = (user) => __awaiter(this, void 0, void 0, function* () {
            // check if user exists in db
            let userExists = yield this.userDb.get({ email: user.email }); //repository pattern
            console.log({ userExists, mail: user.email });
            if (userExists.length) {
                // if user exists throw error
                throw new Error("User with email exists");
            }
            // hash password
            let hashedPassword = this.hashPassword(user.password);
            user.password = hashedPassword;
            return yield this.userDb.save(user);
            // save  user 
        });
        this.hashPassword = (password) => {
            let key = process.env.HASH_PASSWORD_KEY;
            let hmac = (0, crypto_1.createHmac)('sha512', key);
            return hmac.update(password).digest('hex').toString();
        };
        this.encryptDataUsingJWT = (data, durationInSeconds) => __awaiter(this, void 0, void 0, function* () {
            let secret = process.env.JWT_SECRET;
            let encrypted = jsonwebtoken_1.default.sign(data, secret, { expiresIn: durationInSeconds });
            console.log(jsonwebtoken_1.default.verify(encrypted, secret));
            return encrypted;
        });
        this.decodedjwt = (token) => {
            let secret = process.env.JWT_SECRET;
            return jsonwebtoken_1.default.verify(token, secret);
        };
        this.signInUser = (signInDTO) => __awaiter(this, void 0, void 0, function* () {
            // get user with email
            let user = yield this.userDb.getOne({ email: signInDTO.email });
            if (!user) {
                throw new Error("User with email does not exist");
            }
            // hash user password
            let currentPasswordHash = this.hashPassword(signInDTO.password);
            if (user.password !== currentPasswordHash) {
                throw new Error("Invalid password");
            }
            // user is signed in // 
            let dataToEncrypt = {
                username: user.username,
                email: user.email,
                id: user.id,
                role: user.role
            };
            // encrypt email, role, using JWT
            let expirationInSeconds = 60 * 3600;
            console.log(dataToEncrypt);
            let encryptedData = yield this.encryptDataUsingJWT(dataToEncrypt, expirationInSeconds);
            return {
                email: user.email,
                username: user.username,
                role: user.role,
                token: encryptedData,
                expirationInSeconds
            };
        });
    }
}
exports.UserLogic = UserLogic;
