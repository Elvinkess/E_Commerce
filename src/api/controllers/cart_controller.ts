import { Cart } from "../../core/domain/entity/cart";
import {Request, Response,NextFunction} from "express"
import { ICartLogic } from "../../core/usecase/interface/logic/cart_logic";
import { IUserLogic } from "../../core/usecase/interface/logic/user_logic";
import { addItemCartRequest } from "../../core/domain/dto/requests/add_cart_item";
import { RemoveCartItem } from "../../core/domain/dto/requests/remove_cart_item";


export class  CartController{
    constructor(private cart:ICartLogic,user:IUserLogic){}

    getCart = async(req : Request<{userId:number}, {}, {}>, res: Response, next: NextFunction)=>{

        try {
            let cart = await this.cart.get(req.params.userId);
            res.json(cart)
            
        } catch (err) {
            res.json({error: (err as Error).message})
            
        }
    }
    addCartItem = async(req : Request<{}, {}, addItemCartRequest>, res: Response, next: NextFunction)=>{
        try {
            let requestData = req.body
            let updateCart = await this.cart.addItemToCart(requestData);
            res.status(200).json({message: "Item added to cart successfully",data: updateCart});
            
        } catch (err:any) {
            res.status(500).json({ error: err.message || "Failed to add item to cart" })
        }
}

    removeCartItem = async(req : Request<{}, {},RemoveCartItem>, res: Response, next: NextFunction)=>{
            
        try {
            let requestData = req.body
            let updateCart = await this.cart.removeItemFromCart(requestData);
            res.status(200).json({message: "Item removed from cart successfully",data: updateCart});
            
        } catch (err:any) {
            res.status(500).json({ error: err.message || "Failed to remove item from cart" })
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