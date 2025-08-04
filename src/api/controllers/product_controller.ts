import { NextFunction, Request, Response } from "express";
import { IProductLogic } from "../../core/usecase/interface/logic/product_logic";
import { CreateProduct } from "../../core/domain/dto/requests/product_request";
import { ProductResponse } from "../../core/domain/dto/responses/product_response";
import { searchProductsQuery } from "../../core/domain/dto/requests/search_request";
import { Product } from "../../core/domain/entity/product";
import BaseController from "./base_controller";
import UploadFile from "../../core/domain/entity/shared/uploadfile";

// uses the usecase to make appropriate calls from the client (express)
export class ProductController extends BaseController {
    
    constructor(private productLogic: IProductLogic) {
        super();
        
    }
    create= async (req : Request<{}, {}, CreateProduct>, res: Response, next: NextFunction) => {
        try{
            

            let productResponse: ProductResponse = await this.productLogic.create(req.body);
            res.json(productResponse)
        } catch(err){
            res.json({error: (err as Error).message})
        }
    }
    createProductWithImage = async (req : Request<{}, {}>, res: Response, next: NextFunction) => {
        
        try{
            let prodImg: UploadFile | null = this.convertReqFilesToUploadFiles(req, "image")[0]
            let reqBody = req.body.data;
            let createProoductBody = JSON.parse(reqBody) as CreateProduct
            createProoductBody.image = prodImg
            let productResponse: ProductResponse = await this.productLogic.createWithImage(createProoductBody);
            res.json(productResponse)
        } catch(err){
            res.json({error: (err as Error).message})
        }
    }
    search= async (req: Request<{},{},searchProductsQuery>,res:Response, next:NextFunction)=>{
        try {
            let product:Product[] = await this.productLogic.search(req.body)
            res.json(product)
        } catch (err) {
            res.json({error: (err as Error).message})
        }
    }

    getAllproduct= async (req:Request<{},{},{id:number}>,res:Response,next:NextFunction)=>{
        try {
            let Allproducts = await this.productLogic.getAll()
            res.json(Allproducts);
            
        } catch (err) {
            res.json({error: (err as Error).message})
        }
    }
}