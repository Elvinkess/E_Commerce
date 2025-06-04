
import { DataSource } from "typeorm";
import { ICategoriesDB } from "../../../usecase/interface/data_access/categories_db";
import { CategoriesConfig } from "../config/categories_config";
import { BaseDb } from "./base_db";


export class CategoriesDB extends BaseDb<CategoriesConfig> implements ICategoriesDB{
    
    constructor( myDataSource: DataSource) {
        super(  myDataSource, CategoriesConfig)
    }
    
}