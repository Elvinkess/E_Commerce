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
exports.UserFunction = void 0;
class UserFunction {
    constructor(datasource) {
        this.datasource = datasource;
    }
    save(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
        INSERT INTO users ( username, email, password)
        VALUES ($1, $2, $3)
        RETURNING *;
      `;
            const input = [user.userName, user.email, user.password];
            const result = yield this.datasource.query(query, input);
            return result;
        });
    }
    findUser(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `SELECT * FROM users WHERE id = $1 LIMIT 1;`;
            const result = yield this.datasource.query(query, [email]);
            return result ? result : null;
        });
    }
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
            DELETE FROM users
            WHERE id = $1
            RETURNING *;
        `;
            const result = yield this.datasource.query(query, [id]);
            return result;
        });
    }
    ;
}
exports.UserFunction = UserFunction;
