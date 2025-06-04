import { DataSource } from "typeorm";
import { IOrderPaymentDB } from "../../../usecase/interface/data_access/order_payment_db";
import { OrderPaymentConfig } from "../config/order_payment_config";
import { BaseDb } from "./base_db";

export class OrderPaymentDB extends BaseDb<OrderPaymentConfig> implements IOrderPaymentDB{
    
    constructor( myDataSource: DataSource) {
        super(  myDataSource, OrderPaymentConfig)
    }
    
}