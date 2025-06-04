import { IProductResponseInit } from "../../../domain/dto/responses/product_response";
import { Categories } from "../../../domain/entity/categories";
import { Product } from "../../../domain/entity/product";

export interface ICategoriesLogic{
    create(category:Categories):Promise<Categories>
    getAll():Promise<Categories[]>
    remove(category:Categories):Promise<Categories>
    getCategoryproducts(id:number):Promise<Categories>
    
}