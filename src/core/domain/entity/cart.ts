import { MyBaseEntity } from "./shared/my_base_entity";

export class Cart extends MyBaseEntity{
    
    constructor(public cart_item_ids:number[],public user_status:string,public user_id:number | null,public guest_id:string | null){
        super(0);
    }
}
