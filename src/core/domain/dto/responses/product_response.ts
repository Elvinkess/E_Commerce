import { Categories } from "../../entity/categories";
import { inventory } from "../../entity/inventory";
import { Product } from "../../entity/product";
import UploadFile from "../../entity/shared/uploadfile";

export interface IProductResponseInit extends Product {
    
    category?: Categories | null;
    inventory?: inventory | null;
    outOfStock?:boolean
}

export class ProductResponse extends Product{
    category: Categories | null = null;
    inventory: inventory | null = null;
    outOfStock?:boolean


    
     
    constructor(init: IProductResponseInit ) {
    super(init.name, init.price, init.category_id, init.inventory_id, init.image_url);
        this.id = init.id;
        this.category = init.category ?? null;
        this.inventory = init.inventory ?? null;
        this.outOfStock =init.outOfStock
        
    }
}

export  interface PaginatedProductResponse{
    products: ProductResponse[],
    total:number
    page:number
    totalPages: number,
}