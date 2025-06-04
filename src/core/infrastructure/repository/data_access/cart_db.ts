import { DataSource } from "typeorm";
import { ICartDB } from "../../../usecase/interface/data_access/cart_db";
import { CartConfig } from "../config/cart_config";
import { BaseDb } from "./base_db";



export class CartDB extends BaseDb<CartConfig> implements ICartDB{
    
    constructor( myDataSource: DataSource) {
        super(  myDataSource, CartConfig)
    }
    
}