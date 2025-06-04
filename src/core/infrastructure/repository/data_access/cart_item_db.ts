import { DataSource } from "typeorm";
import {  ICartItemDB } from "../../../usecase/interface/data_access/cart_item_db";
import { CartItemConfig } from "../config/cart_item_configs";
import { BaseDb } from "./base_db";


export class CartItemDB extends BaseDb<CartItemConfig> implements ICartItemDB{
    
    constructor( myDataSource: DataSource) {
        super(  myDataSource, CartItemConfig)
    }
    
}