import { MyBaseEntity } from "./shared/my_base_entity";

export class  Order extends MyBaseEntity{
    constructor(public  user_id:number|null,public  guest_id:string|null,public total_price:number,public status:string){
        super(0)
    }

}