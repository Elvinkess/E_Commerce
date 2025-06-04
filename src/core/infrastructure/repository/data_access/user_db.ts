import { DataSource } from "typeorm";
import { IUserDb } from "../../../usecase/interface/data_access/user_db";
import { UserConfig } from "../config/user_config";
import { BaseDb } from "./base_db";

export  class UserDb extends BaseDb<UserConfig> implements IUserDb{
    
    constructor( myDataSource: DataSource) {
        super(  myDataSource, UserConfig)
    }
    
} 