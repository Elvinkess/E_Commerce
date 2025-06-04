import { CreateProduct } from "../../domain/dto/requests/product_request";
import { searchProductsQuery } from "../../domain/dto/requests/search_request";
import { ProductResponse } from "../../domain/dto/responses/product_response";
import { Categories } from "../../domain/entity/categories";
import { inventory } from "../../domain/entity/inventory";
import { Product } from "../../domain/entity/product";
import UploadFile from "../../domain/entity/shared/uploadfile";
import { ICategoriesDB } from "../interface/data_access/categories_db";
import { IInventoryDB } from "../interface/data_access/inventory_db";
import { IProductDB } from "../interface/data_access/product_db";
import { IProductLogic } from "../interface/logic/product_logic";
import IFileService from "../interface/services/file_service";

export class ProductLogic implements  IProductLogic {
   
    constructor(
        private  categoryDb: ICategoriesDB,
        private  inventoryDb: IInventoryDB,
        private productDb: IProductDB,
        private fileService: IFileService
    ) {
        
    }
    
    create = async (create_product: CreateProduct): Promise<ProductResponse> => {
        // verify category exists 
        let category: Categories | null = await this.categoryDb.getOne({id: create_product.category_id})
        if(!category){
            throw new Error(`Category with id ${create_product.category_id} does not exist`)
        }

        // create inventory for product
        let productInventory = new inventory(create_product.quantity_available, 0, 0)
        let savedProductInventory: inventory | null = await this.inventoryDb.save(productInventory)
        console.log(savedProductInventory.id,"inventory ID")

        // add inventory  to product
        let productToSave = new Product(create_product.name, create_product.price, category.id, savedProductInventory.id);
        let savedProduct = await this.productDb.save(productToSave);
        savedProductInventory.product_id = savedProduct.id
        console.log(savedProduct.id,"product ID")
        await this.inventoryDb.save(savedProductInventory)

        // save product
        return new ProductResponse({...savedProduct, category: category, inventory: savedProductInventory})
        // return saved product
    }

    createWithImage = async (create_product: CreateProduct): Promise<ProductResponse> => {
        // verify category exists 
        console.log("Here wqith image")
        let category: Categories | null = await this.categoryDb.getOne({id: create_product.category_id})
        if(!category){
            throw new Error(`Category with id ${create_product.category_id} does not exist`)
        }

        let uploadedFile: UploadFile | null = null;

        if(create_product.image){
            //
            console.log("Image found")
            uploadedFile = await this.fileService.uploadFile(create_product.image)
            console.log({uploadedFile})
        }

        // create inventory for product
        let productInventory = new inventory(create_product.quantity_available, 0, 0)
        let savedProductInventory: inventory | null = await this.inventoryDb.save(productInventory)
        console.log({savedProductInventory})
        // add inventory  to product
        let productToSave = new Product(create_product.name, create_product.price, category.id, savedProductInventory.id, uploadedFile?.secure_url ?? "");

        let savedProduct = await this.productDb.save(productToSave);
        savedProductInventory.product_id = savedProduct.id
        await this.inventoryDb.save(savedProductInventory)

        // save product
        return new ProductResponse({...savedProduct, category: category, inventory: savedProductInventory})
        // return saved product
    }
    getAll = async(): Promise<ProductResponse[]> =>{
        let prods = await  this.productDb.getAll()
    //    return await this.convertProductsToProductResponsesEfficient(prods);
       return await this.convertProductsToProductResponsesEfficient(prods);
    }
    

    
    private convertProductsToProductResponses = async (prods: Product[]) : Promise<ProductResponse[]> => {
        let prodsResponses : ProductResponse[] = []

        for(let i=0; i < prods.length-1; i++){
            let inventoryId =  prods[i].inventory_id;
            let categoryId = prods[i].category_id
            let categoryRes = await this.categoryDb.getOne({id:categoryId})
            let inventoryRes = await this.inventoryDb.getOne({id:inventoryId});
            let product = new ProductResponse({...prods[i], inventory:  inventoryRes, category:  categoryRes})
            prodsResponses.push(product)
           }
    
           return prodsResponses;
    }

    public convertProductsToProductResponsesEfficient = async (prods: Product[]) : Promise<ProductResponse[]> => {
        let prodsResponses : ProductResponse[] = []
        let inventoryIds = prods.map(prod => prod.inventory_id) // 1, 2
        let categoriesIds = prods.map(prod => prod.category_id)
        let inventories = await this.inventoryDb.comparisonSearch({_in: {id: inventoryIds}}) // [{id: 1}, {id: 2}]
        let categories = await this.categoryDb.comparisonSearch({_in: {id: categoriesIds}})

        let inventoryIdSort: {[key: number]: inventory} = {}
        for(let inventory of inventories){
            inventoryIdSort[inventory.id] = inventory //{1:inventory1,2:inventory2}
        }
        let categoryIdSort:{[key:number]:Categories} ={}
        for(let category of categories){
            categoryIdSort[category.id] = category
        }

        for (let product of prods){
            let prodCategory = categoryIdSort[product.category_id]
            let prodInventory = inventoryIdSort[product.inventory_id]
            let _product = new ProductResponse({...product, inventory: prodInventory, category: prodCategory})
            prodsResponses.push(_product)
        }
        return prodsResponses;
    }

    search = async (options: searchProductsQuery): Promise<ProductResponse[] > => {
        //check if the catName is not null
        // If catName is present search for all categories with matching names
        let categories: Categories[] = []

        let products: Product[] = []
        if(options.catName){
            categories = await this.categoryDb.comparisonSearch({contains: {name: options.catName}});
        }

        // if there are categories found, search for products only within these categories
        if(categories.length !== 0){
            products = await this.productDb.comparisonSearch({
                _in: {category_id: categories.map(category => category.id)},
                contains: {name: options.productName ?? ""}
            })
        }
        else if(categories.length === 0){
            products = await this.productDb.comparisonSearch({
                contains: {name: options.productName ?? ""}
            })
        }
        console.log({categories, products, options});
        //return  await this.convertProductsToProductResponsesEfficient(products);
        return await this.convertProductsToProductResponsesEfficient(products);
    }
    
    
}