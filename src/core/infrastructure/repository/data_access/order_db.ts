import { DataSource } from "typeorm";
import { OrderConfig } from "../config/order";
import { BaseDb } from "./base_db";
import { IOrderDB } from "../../../usecase/interface/data_access/order_db";

export class OrderDB extends BaseDb<OrderConfig> implements IOrderDB{
    
    constructor( myDataSource: DataSource) {
        super(  myDataSource, OrderConfig)
    }
    
}