import { MyBaseEntity } from "./shared/my_base_entity";

export class inventory extends MyBaseEntity{
    constructor(public  quantity_available:number, public quantity_sold:number, public product_id:number){
        super(0);
    }
}