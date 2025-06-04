import { DataSource } from "typeorm";
import { DeliveryConfig } from "../config/delivery_config";
import { InventoryConfig } from "../config/inventory_config";
import { BaseDb } from "./base_db";
import { IDeliveryDB } from "../../../usecase/interface/data_access/delivery_db";

export class DeliveryDB extends BaseDb<DeliveryConfig> implements IDeliveryDB{
    
    constructor( myDataSource: DataSource) {
        super(  myDataSource, DeliveryConfig)
    }
    
}