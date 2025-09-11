import { Router } from "express";
import {  authmiddleware, productLogic } from "../program";
import { ProductController } from "../controllers/product_controller";
import { upload } from "../middleware/multer";
import { UserRole } from "../../core/domain/entity/user";


const productsRoute = Router();
let productController = new ProductController(productLogic)
productsRoute.post("/", productController.create)
productsRoute.post("/product-with-image", upload.fields([{name: "image", maxCount: 1}, {name: "icon", maxCount: 1}]),authmiddleware.authenticateJWT, authmiddleware.authorizeRole([UserRole.ADMIN]), productController.createProductWithImage)
productsRoute.get("/paginate",productController.getPaginatedProducts)
productsRoute.post("/search", productController.search)
productsRoute.get("/",   productController.getAllproduct);
productsRoute.get("/:productId",productController.getOne)
productsRoute.delete("/:productId",productController.remove)

export default productsRoute;