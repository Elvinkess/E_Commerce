import { NextFunction, Request, Response } from "express";
import { IProductLogic } from "../../core/usecase/interface/logic/product_logic";
import { CreateProduct } from "../../core/domain/dto/requests/product_request";
import { ProductResponse } from "../../core/domain/dto/responses/product_response";
import { searchProductsQuery } from "../../core/domain/dto/requests/search_request";
import { Product } from "../../core/domain/entity/product";
import BaseController from "./base_controller";
import UploadFile from "../../core/domain/entity/shared/uploadfile";
import { updateProductReq } from "../../core/domain/dto/requests/update_product";
import { HttpErrors } from "../../core/domain/entity/shared/error";

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
            if(err instanceof HttpErrors){return res.status(err.statusCode).json({ error: err.message })}
            res.json({error: (err as Error).message})
        }
    }
    getOne= async (req : Request<{productId:string}, {}, {}>, res: Response, next: NextFunction) => {
        try{
            const productId = Number(req.params.productId)
            if (isNaN(productId)) {
                res.status(400).json({ error: "Invalid product id" });
              }
              
            let productResponse: ProductResponse = await this.productLogic.getOne(productId);
            res.status(200).json({message: "Item updated successfully",data:productResponse});
        } catch(err){
            if(err instanceof HttpErrors){return res.status(err.statusCode).json({ error: err.message })}
            res.status(500).json({ error: (err as Error).message })
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
            if(err instanceof HttpErrors){return res.status(err.statusCode).json({ error: err.message })}
            res.json({error: (err as Error).message})
        }
    }
    search= async (req: Request<{},{},searchProductsQuery>,res:Response, next:NextFunction)=>{
        try {
            let product:Product[] = await this.productLogic.search(req.body)
            res.json(product)
        } catch (err) {
            if(err instanceof HttpErrors){return res.status(err.statusCode).json({ error: err.message })}
            res.json({error: (err as Error).message})
        }
    }
    updateProduct= async (req:Request<{},{},{update:updateProductReq}>,res:Response,next:NextFunction)=>{
        try {
            const update = req.body.update
            let updateProduct = await this.productLogic.update(update)
            res.json(updateProduct);
            
        } catch (err) {
            if(err instanceof HttpErrors){return res.status(err.statusCode).json({ error: err.message })}
            res.json({error: (err as Error).message})
        }
    }

    getAllproduct= async (req:Request<{},{},{}>,res:Response,next:NextFunction)=>{
        try {
            let Allproducts = await this.productLogic.getAll()
            res.json(Allproducts);
            
        } catch (err) {
            if(err instanceof HttpErrors){return res.status(err.statusCode).json({ error: err.message })}
            res.json({error: (err as Error).message})
        }
    }
    getPaginatedProducts = async(req:Request<{},{},{},{page:number,limit:number}>,res:Response,next:NextFunction)=>{
        try {
            const page = Number(req.query.page)
            const limit = Number(req.query.limit)
            if (isNaN(page) || isNaN(limit)) {  res.status(400).json({ error: "Invalid query parameters. 'page' and 'limit' must be numbers." });}
            const products = await this.productLogic.getAllPaginate(page,limit)
            res.json(products)
        } catch (err) {
            if(err instanceof HttpErrors){return res.status(err.statusCode).json({ error: err.message })}
            res.json({error: (err as Error).message})
        }
    }
    remove= async(req:Request<{productId:number},{},{}>,res:Response,next:NextFunction)=>{
        try {
    
            const{productId}= req.params
            const response = await this.productLogic.remove(productId)
            res.json(response)
        } catch (err) {
            if(err instanceof HttpErrors){return res.status(err.statusCode).json({ error: err.message })}
            res.json({error: (err as Error).message})
        }
    }
}