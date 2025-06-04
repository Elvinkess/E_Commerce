
import { DataSource } from "typeorm";
import { BaseDb } from "./base_db";
import { InventoryConfig } from "../config/inventory_config";
import { IInventoryDB } from "../../../usecase/interface/data_access/inventory_db";


export class InventoryDB extends BaseDb<InventoryConfig> implements IInventoryDB{
    
    constructor( myDataSource: DataSource) {
        super(  myDataSource, InventoryConfig)
    }
    
}