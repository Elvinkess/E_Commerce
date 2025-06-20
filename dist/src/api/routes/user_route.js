"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_controller_1 = require("../controllers/user_controller");
const express_1 = require("express");
const program_1 = require("../program");
const user_1 = require("../../core/domain/entity/user");
const userRoute = (0, express_1.Router)();
let userController = new user_controller_1.UserController(program_1.userLogic);
userRoute.post("/", userController.createUser);
userRoute.post("/signin", userController.signInUser);
userRoute.get("/protected", program_1.authmiddleware.authenticateJWT, program_1.authmiddleware.authorizeRole([user_1.UserRole.USER]), (req, res) => {
    res.json({ message: "You have access to this protected route!" });
});
exports.default = userRoute;
