import { Categories } from "../../core/domain/entity/categories";
import { ICategoriesLogic } from "../../core/usecase/interface/logic/categories_logic";
import {Request, Response,NextFunction} from "express"
import { IProductLogic } from "../../core/usecase/interface/logic/product_logic";

export class CategoriesController{

    constructor(private categories:ICategoriesLogic,private product:IProductLogic){
       
    }
     createCategories = async (req : Request<{}, {}, Categories>, res: Response, next: NextFunction)=>{
        try {
            console.log({body: req.body})
            let categories = await this.categories.create(req.body)
            res.json(categories);
        } catch (ex) {
            console.log(ex)
            res.json({error: (ex as Error).message})
        }
    }
    removeCategories = async (req:Request<{},{},Categories>,res:Response,next:NextFunction)=>{
        try {
            let removeCat = await this.categories.remove(req.body)
            res.json(removeCat)
        } catch (ex) {
            console.log(ex)
            res.json({error: (ex as Error).message})
        }
    }

    getAllCategories = async (req:Request<{},{},{}>,res:Response,next:NextFunction)=>{
        try {
            let AllCategories = await this.categories.getAll()
            res.json(AllCategories);
            
        } catch (ex) {
            console.log(ex)
            res.json({error: (ex as Error).message})
        }
    }

    getCatproducts = async (req:Request<{},{},{id:number}>,res:Response,next:NextFunction)=>{
        try {
            let AllCatprodcts = await  this.categories.getCategoryproducts(req.body.id)
            res.json(AllCatprodcts)
        } catch (ex) {
            console.log(ex)
            res.json({error: (ex as Error).message})
        }
    }

    
    
}