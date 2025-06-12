"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.UserRole = void 0;
const my_base_entity_1 = require("./shared/my_base_entity");
var UserRole;
(function (UserRole) {
    UserRole["USER"] = "user";
    UserRole["ADMIN"] = "admin";
    UserRole["EDITOR"] = "editor";
})(UserRole || (exports.UserRole = UserRole = {}));
class User extends my_base_entity_1.MyBaseEntity {
    constructor(_username, _email, _password, _role) {
        let _id = 0;
        super(_id);
        this.username = _username;
        this.email = _email;
        this.password = _password;
        this.role = _role;
    }
}
exports.User = User;
