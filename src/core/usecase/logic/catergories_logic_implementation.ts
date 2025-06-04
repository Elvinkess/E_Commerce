import { Categories } from "../../domain/entity/categories";
import { ICategoriesLogic } from "../interface/logic/categories_logic";
import { ICategoriesDB } from "../interface/data_access/categories_db";
import { IProductDB } from "../interface/data_access/product_db";

export class CategoriesLogic  implements ICategoriesLogic{
    constructor(private categoriesDb:ICategoriesDB,private productDb:IProductDB){

    }
    create = async (categories:Categories):Promise<Categories>=> {
        let  cat = await this.categoriesDb.get({name: categories.name})
        if(cat.length){
            throw new Error("Category with name exists: " + categories.name)
        }
        let category = await this.categoriesDb.save(categories);
        return category
    }

    getAll = async (): Promise<Categories[]>  =>{
        return await this.categoriesDb.getAll()
    }

    remove = async(categories:Categories):Promise<Categories> =>{
        let  cat = await this.categoriesDb.get({id: categories.id})
    
        console.log({categories, cat})
        if(!cat || !cat.length){
            throw new Error(`Category with id ${categories.id} does not  exists`)
        }
        return await this.categoriesDb.remove({id: categories.id});
        
    }

    getCategoryproducts=  async (categoryId: number): Promise<Categories> => {
        // get category with id from db
        let  category = await this.categoriesDb.getOne({id: categoryId});
        if(!category){
            throw new Error(`Category with id ${categoryId} does not  exists`)
        }
        // if category is found 
        // get all products  having the category id 
        let products = await this.productDb.get({category_id: categoryId})

        category.products=products
        console.log(category)
        return category


        // category.products = productsResponse
        // return category
    }
    
}