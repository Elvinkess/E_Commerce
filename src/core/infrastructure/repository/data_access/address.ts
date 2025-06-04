import { DataSource } from "typeorm";
import { AddressConfig } from "../config/address_config";
import { BaseDb } from "./base_db";
import { IAddressDB } from "../../../usecase/interface/data_access/address_db";

export class AddressDB extends BaseDb<AddressConfig> implements IAddressDB{
    
    constructor( myDataSource: DataSource) {
        super(  myDataSource, AddressConfig)
    }
    
}