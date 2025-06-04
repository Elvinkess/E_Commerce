import { Cart } from "../../entity/cart";
import { CartItem } from "../../entity/cart_item";
import { ProductResponse } from "./product_response";


export enum CartItemStatus{
    LessQuantity = "less Quantity",
    OverPriced = "Over Priced",
    UnderPriced =  "Under Priced",
    Unavailable = "Unavailable",
    Okay ="Okay"
}
export class  productInCartRes{
    name!:string;

    constructor(_name:string){
        this.name =_name
        
    }
    
        
}
export class CartItemResponse extends  CartItem{
    constructor(init:CartItem){
        super(init.cart_id,init.product_id,init.purchased_price,init.quantity)
        this.id =init.id
    }
    product?:ProductResponse
    // setCatItemStatus = ()=>{
    //     if(!this.product){
    //         return CartItemStatus.Unavailable
    //     }else if(this.product.price < this.purchased_price){
    //         return  CartItemStatus.OverPriced
    //     }else if(this.product.price > this.purchased_price){
    //         return CartItemStatus.UnderPriced
    //     }else if(this.product.inventory?.quantity_available ?? 0 < this.quantity){
    //         return CartItemStatus.LessQuantity
    //     }
    //     else{
    //         return CartItemStatus.Okay
    //     }
    // }
    setCatItemStatus = (): CartItemStatus => {
        if (!this.product) {
            return CartItemStatus.Unavailable;
        }
    
        else if ((this.product.inventory?.quantity_available ?? 0) < this.quantity) {
            console.log({i:this.product?.inventory,q:this.quantity})
            return CartItemStatus.LessQuantity;
        }
    
        else if (this.product.price < this.purchased_price) {
            return CartItemStatus.OverPriced;
        }
    
        else if (this.product.price > this.purchased_price) {
            return CartItemStatus.UnderPriced;
        }
    
        return CartItemStatus.Okay;
    };
    

updateCartItemStatus  = ()=>{
    this.status = this.setCatItemStatus()
}
    status?: CartItemStatus 

}



export class CartResponse extends Cart{
    cart_items!:CartItemResponse[]

}