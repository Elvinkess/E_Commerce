import { Cart } from "../../core/domain/entity/cart";
import {Request, Response,NextFunction} from "express"
import { ICartLogic } from "../../core/usecase/interface/logic/cart_logic";
import { IUserLogic } from "../../core/usecase/interface/logic/user_logic";
import { addItemCartReq } from "../../core/domain/dto/requests/cart_request";


export class  CartController{
    constructor(private cart:ICartLogic,user:IUserLogic){}
createCart  =  async(req : Request<{}, {}, Cart>, res: Response, next: NextFunction)=>{
    try {
        let cart = await this.cart.create(req.body);
        res.json(cart);
        
        
    } catch (err) {
        res.json({error: (err as Error).message})
    }
}

getCart = async(req : Request<{userId:number}, {}, {}>, res: Response, next: NextFunction)=>{

    try {
        let cart = await this.cart.get(req.params.userId);
        res.json(cart)
        
    } catch (err) {
        res.json({error: (err as Error).message})
        
    }
}

remove = async(req : Request<{cartId:number}, {},{} >, res: Response, next: NextFunction)=>{

    try {
        let remove = await this.cart.delete(req.params.cartId);
        res.status(200).json(remove)
        
    } catch (err) {
        res.status(500).json({ error: (err as Error).message }); 
        
    }
}
}