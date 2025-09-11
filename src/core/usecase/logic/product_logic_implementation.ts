import { CreateProduct } from "../../domain/dto/requests/product_request";
import { searchProductsQuery } from "../../domain/dto/requests/search_request";
import { updateProductReq } from "../../domain/dto/requests/update_product";
import { PaginatedProductResponse, ProductResponse } from "../../domain/dto/responses/product_response";
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
    ) {}
  getAllPaginate=async (page: number, limit: number): Promise<PaginatedProductResponse> =>{

    const[product,total] = await this.productDb.findPaginated(page,limit)
    const productRes = await this.convertProductsToProductResponsesEfficient(product)
    return{products:productRes,total, page,totalPages: Math.ceil(total / limit)} as PaginatedProductResponse
  
  }


    update = async (req: updateProductReq): Promise<ProductResponse> => {
        let product = await this.productDb.getOne({ id: req.id });
        if (!product) {
          throw new Error("Product not found");
        }
      
        const updateData: Partial<Product> = {};
        let uploadedFile: UploadFile | null = null;
      
        if (req.name !== undefined) updateData.name = req.name;
        if (req.price !== undefined) updateData.price = req.price;
        if (req.category_id !== undefined) updateData.category_id = req.category_id;
      
        if (req.image !== undefined) {
          uploadedFile = await this.fileService.uploadFile(req.image);
          if (uploadedFile) {
            updateData.image_url = uploadedFile.secure_url;
          }
        }
      
        if (req.quantity_available !== undefined) {
          await this.inventoryDb.update(
            { product_id: req.id },
            { quantity_available: req.quantity_available }
          );
        }
      
        // Now update product
        const updatProduct = await this.productDb.update({ id: req.id }, updateData);
        if(updatProduct=== null){throw new Error("Error trying to update product")}
      
        return this.convertProductToProductResponse(updatProduct);
    };
      

    remove =async(productId: number): Promise<boolean>=> {
        const product = await this.productDb.getOne({id:productId})

        if(!product){throw new Error("Product does not exist")}

        await this.productDb.remove({id:productId})
        await this.inventoryDb.remove({product_id:product.id})
        return true
    }




    getOne =async(productId: number): Promise<ProductResponse> =>{
        const prod =await this.productDb.getOne({id:productId})
        if(!prod){throw new Error("Product not found")}
        return this.convertProductToProductResponse(prod)
        
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

    createWithImage = async (req: CreateProduct): Promise<ProductResponse> => {
        if (!req.category_name) {
          throw new Error("Category Name not Provided");
        }
      
        // normalize category name (avoid duplicates like "Books" vs "books")
        const categoryName = req.category_name.toUpperCase();
        const productName =req.name.toUpperCase()
      
        // check if category exists
        let category = await this.categoryDb.getOne({ name: categoryName });
      
        // create new category if isn't available
        if (!category) {
          const newCategory = new Categories(categoryName, "Best Product", []);
          category = await this.categoryDb.save(newCategory);
        }
      
        // handle image upload
        let uploadedFile: UploadFile | null = null;
        if (req.image) {
          uploadedFile = await this.fileService.uploadFile(req.image);
        }
      
        // create inventory for product
        const productInventory = new inventory(req.quantity_available, 0, 0);
        const savedProductInventory = await this.inventoryDb.save(productInventory);
      
        // create product
        const productToSave = new Product(
          productName,
          req.price,
          category.id,
          savedProductInventory.id,
          uploadedFile?.secure_url ?? ""
        );
      
        const savedProduct = await this.productDb.save(productToSave);
      
        // link product to inventory
        savedProductInventory.product_id = savedProduct.id;
        await this.inventoryDb.save(savedProductInventory);
      
        // return response
        return new ProductResponse({
          ...savedProduct,
          category,
          inventory: savedProductInventory,
        });
      };
      


    getAll = async(): Promise<ProductResponse[]> =>{
        let prods = await  this.productDb.getAll()
    //    return await this.convertProductsToProductResponsesEfficient(prods);
       return await this.convertProductsToProductResponsesEfficient(prods);
    }

    private convertProductToProductResponse = async (prod: Product): Promise<ProductResponse> => {
        const inventoryId = prod.inventory_id;
        const categoryId = prod.category_id;
    
        const categoryRes = await this.categoryDb.getOne({ id: categoryId });
        const inventoryRes = await this.inventoryDb.getOne({ id: inventoryId });
        const outOfStock = (inventoryRes?.quantity_available ?? 0) < 1;

    
        const productResponse = new ProductResponse({
            ...prod,
            inventory: inventoryRes,
            category: categoryRes,
            outOfStock:outOfStock
        });
    
        return productResponse;
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
            const prodCategory = categoryIdSort[product.category_id]
            const prodInventory = inventoryIdSort[product.inventory_id]

            const outOfStock = (prodInventory?.quantity_available ?? 0) < 1
            const _product = new ProductResponse({...product, inventory: prodInventory, category: prodCategory,outOfStock})
            prodsResponses.push(_product)
        }
        return prodsResponses;
    }

    search = async (options: searchProductsQuery): Promise<ProductResponse[] > => {
        //check if the catName is not null
        // If catName is present search for all categories with matching names
        const productName = options.productName.toUpperCase()
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
                contains: {name: productName ?? ""}
            })
        }
        console.log({categories, products, options});
        //return  await this.convertProductsToProductResponsesEfficient(products);
        return await this.convertProductsToProductResponsesEfficient(products);
    }
    
    
}