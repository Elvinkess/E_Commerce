import { MyBaseEntity } from "./shared/my_base_entity";

export class CartItem extends MyBaseEntity{
    constructor( public cart_id:number,public product_id:number,public purchased_price:number,public quantity:number){
        let _id = 0
        super(_id);

    }
}