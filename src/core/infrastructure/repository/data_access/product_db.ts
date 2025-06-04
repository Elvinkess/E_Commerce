
import { DataSource } from "typeorm";
import { BaseDb } from "./base_db";
import { InventoryConfig } from "../config/inventory_config";
import { IInventoryDB } from "../../../usecase/interface/data_access/inventory_db";
import { IProductDB } from "../../../usecase/interface/data_access/product_db";
import { Product } from "../../../domain/entity/product";
import { ProductConfig } from "../config/product_config";


export class ProductDB extends BaseDb<ProductConfig> implements IProductDB{
    
    constructor( myDataSource: DataSource) {
        super(  myDataSource, ProductConfig)
    }
    
}