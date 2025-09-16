import {Request, Response,NextFunction} from "express"
import { ICartLogic } from "../../core/usecase/interface/logic/cart_logic";
import { addItemCartRequest } from "../../core/domain/dto/requests/add_cart_item";
import { IUserLogic } from "../../core/usecase/interface/logic/user_logic";
import { AuthRequest } from "../middleware/auth_role_middleware";


export class  CartController{
    constructor(private cart:ICartLogic){}

    getCart = async(req : Request<{}, {}, {},{userId?:string,guestId?:string}>, res: Response, next: NextFunction)=>{

        try {
            const userId = req.query.userId ? Number(req.query.userId) : null;
            const guestId = req.query.guestId ? String(req.query.guestId) : null;

            if (!userId && !guestId) {
            return res.status(400).json({ error: "Either userId or guestId is required" });
            }
            let cart = await this.cart.get(userId,guestId);
            res.json(cart)
            
        } catch (err) {
            res.json({error: (err as Error).message})
            
        }
    }
    addCartItem = async(req : Request<{}, {}, addItemCartRequest>, res: Response, next: NextFunction)=>{
        try {
            let requestData = req.body
            if(!requestData.user_id && !requestData.guest_id){ return  res.status(400).json({ error: "Either userId or guestId must be provided" });}

            if (!requestData.product_id) {return res.status(400).json({ error: "product_id is required" }) }

            if (!requestData.quantity || requestData.quantity < 1) {return res.status(400).json({ error: "Quantity must be at least 1" })}
            const requestDataProcessed = {
                ...requestData,
                user_id: requestData.user_id ? Number(requestData.user_id) : null,
                product_id: Number(requestData.product_id),
              };

            let updateCart = await this.cart.addItemToCart(requestDataProcessed);
            res.status(200).json({message: "Item added to cart successfully",data: updateCart});
            
        } catch (err:any) {
            res.status(500).json({ error: err.message || "Failed to add item to cart" })
        }
    }

    updateCartItem = async(req : Request<{userId?:string,productId:string},{}, {quantity:number,guestId?:string} >, res: Response, next: NextFunction)=>{
        try {

            const{userId,productId}= req.params
            const {quantity,guestId} = req.body

            if (!quantity || quantity < 1) {return res.status(400).json({ error: "Quantity must be at least 1" });}
            if (!userId && !guestId) {
                return  res.status(400).json({ error: "Either userId or guestId must be provided" });
              }
             
              const updateCart = await this.cart.updateCartItem({
                userId: userId ? Number(userId) : null,
                guestId: guestId ?? null,
                productId: productId,
                quantity,
              });

            res.status(200).json({message: "Item updated successfully",data: updateCart});
            
        } catch (err:any) {
            res.status(500).json({ error: err.message || "Failed to update item in cart" })
        }
    }

    removeCartItem = async(req : Request<{userId?:string,productId:string}, {},{guestId?:string}>, res: Response, next: NextFunction)=>{
            
        try {
            const userId = req.params.userId ? Number(req.params.userId) : null;
            const guestId = req.body.guestId ? String(req.body.guestId) : null;
            const productId = Number(req.params.productId)

            if (!userId && !guestId) {return res.status(400).json({ error: "Either userId or guestId must be provided" })}

            const updateCart = await this.cart.removeItemFromCart({userId,guestId,productId});
            res.status(200).json({message: "Item removed from cart successfully",data: updateCart});
            
        } catch (err:any) {
            res.status(500).json({ error: err.message || "Failed to remove item from cart" })
        }
    }

    remove = async(req : Request<{userId?:number}, {},{},{guestId?:string} >, res: Response, next: NextFunction)=>{

        try {
            const userId = req.params.userId ? Number(req.params.userId) : null;
            const guestId = req.query.guestId ?? null;
            console.log(userId,guestId)
        
            if (!userId && !guestId) {
              return res.status(400).json({ error: "Either userId or guestId must be provided" });
            }
            let remove = await this.cart.delete(userId,guestId);
            res.status(200).json(remove)
            
        } catch (err) {
            res.status(500).json({ error: (err as Error).message }); 
            
        }
    }
    mergeCart = async(req : AuthRequest<{}, {}, {},{guestId?:string}>, res: Response, next: NextFunction)=>{

        try {
            const token = req.cookies?.token;
            if (!token) {res.status(401).json({ message: "Unauthorized" });return}
                console.log("in merge controller")
            console.log(req.user?.id,"user id")

            const userId = Number(req.user?.id)
            const guestId = req.query.guestId ? String(req.query.guestId) : null;

            if (!userId || !guestId) {
            return res.status(400).json({ error: "Both userId or guestId is required" });
            }
            let cart = await this.cart.mergeCart(userId,guestId);
            if (!cart) {return res.status(200).json({ message: "No guest cart to merge", cart: null })}
            console.log("merged success")
            return res.status(200).json(cart);

            
        } catch (err:any) {
            console.log("not merged")
            res.status(500).json({ error: err.message || "Failed to merge cart" });

            
        }
    }
}