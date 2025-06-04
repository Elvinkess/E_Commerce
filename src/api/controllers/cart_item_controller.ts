import { Request,Response,NextFunction } from "express";
import { CartItem } from "../../core/domain/entity/cart_item";
import { ICartItemLogic } from "../../core/usecase/interface/logic/cart_item_logic";

export class  CartItemController{
    constructor(private cartItemLogic:ICartItemLogic){}
    create = async (req : Request<{}, {}, CartItem>, res: Response, next: NextFunction) => {
        try{
            let cartItem = await this.cartItemLogic.create(req.body);
            res.json(cartItem)
        } catch(ex){
            res.json({error: (ex as Error).message})
        }
    }

    remove = async(req : Request<{cartItemId:number}, {},{} >, res: Response, next: NextFunction)=>{

        try {
            console.log(req.params.cartItemId,"this the cartitem Id")
            let remove = await this.cartItemLogic.delete(req.params.cartItemId);
            res.status(200).json(remove)
            
        } catch (err) {
            res.status(500).json({ error: (err as Error).message }); 
            
        }
    }
  
}

