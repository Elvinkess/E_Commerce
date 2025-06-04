import { MyBaseEntity } from "./shared/my_base_entity";

export class Cart extends MyBaseEntity{
    
    constructor(public user_id:number,public cart_item_ids:number[],public user_status:string){
        super(0);
    }
}
