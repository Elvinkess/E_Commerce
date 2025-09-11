import { Product } from "../../../domain/entity/product";
import { IBaseDb } from "./base_db";

export interface IProductDB extends IBaseDb<Product>{
}