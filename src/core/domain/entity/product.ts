import { MyBaseEntity } from "./shared/my_base_entity";

export class Product extends MyBaseEntity{
    
    constructor(public name:string,public price:number,public category_id:number, public inventory_id: number, public image_url: string = ""){
        super(0);
    }
}

// name, price, inventoryId, categoryId