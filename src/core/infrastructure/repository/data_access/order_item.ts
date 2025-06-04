import { DataSource } from "typeorm"
import { OrderItemConfig } from "../config/order_item_config"
import { BaseDb } from "./base_db"

export class OrderItemDB extends BaseDb<OrderItemConfig> implements OrderItemDB{
    
    constructor( myDataSource: DataSource) {
        super(  myDataSource, OrderItemConfig)
    }
    
}