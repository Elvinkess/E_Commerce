import { CreateProduct } from "../../../domain/dto/requests/product_request";
import { searchProductsQuery } from "../../../domain/dto/requests/search_request";
import { ProductResponse } from "../../../domain/dto/responses/product_response";
import { Product } from "../../../domain/entity/product";

export interface IProductLogic {
    create(product:CreateProduct):Promise<ProductResponse>
    createWithImage (create_product: CreateProduct): Promise<ProductResponse>
    getAll():Promise<ProductResponse[]>
    search(options: searchProductsQuery ):Promise< ProductResponse[] >
    convertProductsToProductResponsesEfficient (prods: Product[]) : Promise<ProductResponse[]> 
}