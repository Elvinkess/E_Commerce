import { CreateCartItem } from "../../domain/dto/requests/cart_request";
import { CartItem } from "../../domain/entity/cart_item";
import { ICartDB } from "../interface/data_access/cart_db";
import { ICartItemDB } from "../interface/data_access/cart_item_db";
import { IProductDB } from "../interface/data_access/product_db";
import { ICartItemLogic } from "../interface/logic/cart_item_logic";

export class CartItemLogic implements ICartItemLogic{
    constructor(private cartItemDB: ICartItemDB,private cartDB:ICartDB,private productDB:IProductDB){
      
    }
    create = async(cartItemData: CreateCartItem): Promise<CartItem> =>{
        
        let cartExist =  await this.cartDB.getOne({id:cartItemData.cart_id});
        let  productExist = await this.productDB.getOne({id:cartItemData.product_id});
        let cartItems = await this.cartItemDB.get({cart_id:cartItemData.cart_id});
        for(let cartItem of cartItems){
            if(cartItem.product_id === cartItemData.product_id){
                cartItem.quantity += cartItemData.quantity
                await this.cartItemDB.update({id:cartItem.id},{quantity:cartItem.quantity});
                return cartItem
            }
        }
        
        if(cartExist && productExist){
            let cartItem = new CartItem(cartItemData.cart_id,cartItemData.product_id,productExist.price,cartItemData.quantity,)
             cartItem = await  this.cartItemDB.save(cartItem);
        return cartItem
            
        }else{
            throw new Error("Either of CartID or  ProductID doesn't exist");
        }
        
    }
    delete  = async  (cartItemId: number): Promise<CartItem> =>{
        let cartItem = await this.cartItemDB.remove({id:cartItemId})
        if(cartItem){
          return cartItem
        }else{
          throw new Error("cartItem not found hence  cannot be deleted");
  
        }
    }

    

    
}