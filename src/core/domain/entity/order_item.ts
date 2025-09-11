import { MyBaseEntity } from "./shared/my_base_entity";

export class OrderItem extends MyBaseEntity{
    constructor(public order_id:number,public product_id:number,public product_name:string,public quantity:number,public price:number,public created_at:string,public message:string = ""){
        super(0)
    }
}