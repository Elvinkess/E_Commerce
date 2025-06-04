import { Order } from "../../../domain/entity/order";
import { IBaseDb } from "./base_db";

export interface IOrderDB extends IBaseDb<Order>{}