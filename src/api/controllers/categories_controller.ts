import { Categories } from "../../core/domain/entity/categories";
import { ICategoriesLogic } from "../../core/usecase/interface/logic/categories_logic";
import {Request, Response,NextFunction} from "express"
import { IProductLogic } from "../../core/usecase/interface/logic/product_logic";
import { HttpErrors } from "../../core/domain/entity/error";

export class CategoriesController{

    constructor(private categories:ICategoriesLogic,private product:IProductLogic){
       
    }
     createCategories = async (req : Request<{}, {}, Categories>, res: Response, next: NextFunction)=>{
        try {
            let categories = await this.categories.create(req.body)
            res.json(categories);
        } catch (err) {
            if(err instanceof HttpErrors){return res.status(err.statusCode).json({ error: err.message })}
            res.json({error: (err as Error).message})
        }
    }
    removeCategories = async (req:Request<{},{},Categories>,res:Response,next:NextFunction)=>{
        try {
            let removeCat = await this.categories.remove(req.body)
            res.json(removeCat)
        } catch (err) {
            if(err instanceof HttpErrors){return res.status(err.statusCode).json({ error: err.message })}
            res.json({error: (err as Error).message})
        }
    }

    getAllCategories = async (req:Request<{},{},{}>,res:Response,next:NextFunction)=>{
        try {
            let AllCategories = await this.categories.getAll()
            res.json(AllCategories);
            
        } catch (err) {
            if(err instanceof HttpErrors){return res.status(err.statusCode).json({ error: err.message })}
            res.json({error: (err as Error).message})
        }
    }

    getCatproducts = async (req:Request<{},{},{id:number}>,res:Response,next:NextFunction)=>{
        try {
            let AllCatprodcts = await  this.categories.getCategoryproducts(req.body.id)
            res.json(AllCatprodcts)
        } catch (err) {
            if(err instanceof HttpErrors){return res.status(err.statusCode).json({ error: err.message })}
            res.json({error: (err as Error).message})
        }
    }
    
}