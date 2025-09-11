import { UserController } from "../controllers/user_controller"
import { Router } from "express";
import { authmiddleware, userLogic } from "../program";
import { UserRole } from "../../core/domain/entity/user";
import { Validator } from "../middleware/validator";


const userRoute = Router();
const validator = new Validator()
const userController = new UserController(userLogic)
userRoute.post("/",validator.signValidation,validator.validate, userController.createUser)
userRoute.post("/signin", userController.signInUser)
userRoute.get("/decode",userController.decodeUser)
userRoute.get("/protected",authmiddleware.authenticateJWT, authmiddleware.authorizeRole([UserRole.ADMIN]), (req, res) => {
    res.json({ message: "You have access to this protected route!" });
  });

export default userRoute;