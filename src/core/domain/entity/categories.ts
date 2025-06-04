import { Product } from "./product";
import { MyBaseEntity } from "./shared/my_base_entity";



export class Categories extends MyBaseEntity{
    constructor(public name:string, public description:string,public products:Product[]){
        let _id = 0
        super(_id);

    }
}