import { MyBaseEntity } from "./shared/my_base_entity";

export class  Order extends MyBaseEntity{
    constructor(public  user_id:number,public total_price:number,public status:string){
        super(0)
    }

}