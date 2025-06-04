import { User } from "../../../domain/entity/user";
import { IBaseDb } from "./base_db";

export interface IUserDb extends IBaseDb< User> {
    
}