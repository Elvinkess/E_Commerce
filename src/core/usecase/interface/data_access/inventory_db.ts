import { inventory } from "../../../domain/entity/inventory";
import { IBaseDb } from "./base_db";

export interface IInventoryDB extends IBaseDb<inventory>{
}