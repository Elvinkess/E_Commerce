import { Router } from "express";
import { CategoriesController } from "../controllers/categories_controller";
import { authmiddleware, categoriesLogic, productLogic } from "../program";
import { UserRole } from "../../core/domain/entity/user";


const categoriesRoute = Router();
let categoriesController = new CategoriesController(categoriesLogic,productLogic)
categoriesRoute.post("/", authmiddleware.authenticateJWT, authmiddleware.authorizeRole([UserRole.ADMIN]),categoriesController.createCategories)
categoriesRoute.delete("/",authmiddleware.authenticateJWT, authmiddleware.authorizeRole([UserRole.ADMIN]),categoriesController.removeCategories)
categoriesRoute.get("/",categoriesController.getAllCategories);
categoriesRoute.get("/getCatProducts",categoriesController.getCatproducts);

export default categoriesRoute;