import { UserController } from "../controllers/user_controller"
import { Router } from "express";
import { authmiddleware, userLogic } from "../program";
import { UserRole } from "../../core/domain/entity/user";


const userRoute = Router();
let userController = new UserController(userLogic)
userRoute.post("/", userController.createUser)
userRoute.post("/signin", userController.signInUser)
userRoute.get("/protected",authmiddleware.authenticateJWT, authmiddleware.authorizeRole([UserRole.USER]), (req, res) => {
    res.json({ message: "You have access to this protected route!" });
  });

export default userRoute;