import { addItemCartReq } from "../../domain/dto/requests/cart_request";
import { CartItemResponse, CartResponse, productInCartRes } from "../../domain/dto/responses/product_cart_response";
import { Cart } from "../../domain/entity/cart";
import { cart_status } from "../../domain/enums/cart_status_enum";
import { ICartDB } from "../interface/data_access/cart_db";
import { ICartItemDB } from "../interface/data_access/cart_item_db";
import { IProductDB } from "../interface/data_access/product_db";
import { IUserDb } from "../interface/data_access/user_db";
import { ICartLogic } from "../interface/logic/cart_logic";
import { IProductLogic } from "../interface/logic/product_logic";

export class CartLogic implements ICartLogic{
    constructor(private cartDB: ICartDB,private userDB:IUserDb,private  cartItemDB:ICartItemDB,private productDB:IProductDB,private productlogic:IProductLogic){

    }
 
    create = async(cart: Cart): Promise<Cart> =>{
        let cartUserExist  = await this.userDB.get({id:cart.user_id});
        let activeCart =   await this.cartDB.getOne({user_id:cart.user_id,user_status:cart_status.ACTIVE})

        if(!cartUserExist.length){
            throw new Error("User doesnt exist")
        }

      if(activeCart){
        return activeCart
      }
      else{
        let _cart = new Cart(cart.user_id,[],cart_status.ACTIVE)
        return await  this.cartDB.save(_cart)
         
      }
        
    }


    get= async (userId:number): Promise< CartResponse | null>=>{

        let activeCart =   await this.cartDB.getOne({user_id:userId,user_status:cart_status.ACTIVE})
        if(!activeCart){
            return null
        }
               
        let activeCartResponse  = activeCart as CartResponse

        let cartItems =  await this.cartItemDB.get({cart_id:activeCart?.id}) 
        let cartProducts  = await this.productlogic.convertProductsToProductResponsesEfficient (await this.productDB.comparisonSearch({_in:{id:cartItems.map(item => item.product_id)}}))
        let cartItemresponses:CartItemResponse[] = []
        
        for(let cartItem of cartItems){
            let product = cartProducts.find(prod => prod.id === cartItem.product_id)
                let cartitemResponse =  new CartItemResponse(cartItem)
                cartitemResponse.product=product
                cartitemResponse.updateCartItemStatus()
                cartItemresponses.push(cartitemResponse);       
        }
             
        activeCartResponse.cart_items = cartItemresponses
        return activeCartResponse

    }
    
    delete  = async  (cartId: number): Promise<Cart> =>{

      let cart = await  this.cartDB.getOne({id:cartId});
      if(!cart){ throw new Error("There's no  cart with this Id  number")}
      if(cart?.user_status !==  cart_status.ACTIVE){ throw new Error("Cannot deleted a  cart whose status is  Active")}
      let cartToRemove = await this.cartDB.remove({id:cartId})
        return cartToRemove
  }
}