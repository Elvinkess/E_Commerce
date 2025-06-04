export class addItemCartReq{
    cartId!:number
    cart_item_id!:number
    user_id!:number
    
}

export class  CreateCartItem{
    constructor( public cart_id:number,public product_id:number,public quantity:number){

    }

}