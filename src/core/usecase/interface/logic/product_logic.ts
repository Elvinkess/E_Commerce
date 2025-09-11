import { CreateProduct } from "../../../domain/dto/requests/product_request";
import { searchProductsQuery } from "../../../domain/dto/requests/search_request";
import { updateProductReq } from "../../../domain/dto/requests/update_product";
import { PaginatedProductResponse, ProductResponse } from "../../../domain/dto/responses/product_response";
import { Product } from "../../../domain/entity/product";

export interface IProductLogic {
    create(product:CreateProduct):Promise<ProductResponse>
    createWithImage (create_product: CreateProduct): Promise<ProductResponse>
    getAll():Promise<ProductResponse[]>
    getAllPaginate(page:number,limit:number):Promise<PaginatedProductResponse>
    search(options: searchProductsQuery ):Promise< ProductResponse[] >
    getOne(productId:number):Promise<ProductResponse>
    update(req:updateProductReq):Promise<ProductResponse>
    remove(productId:number):Promise<boolean>
    convertProductsToProductResponsesEfficient (prods: Product[]) : Promise<ProductResponse[]> 
}

