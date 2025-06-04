import { OrderItem } from "../../../domain/entity/order_item";
import { IBaseDb } from "./base_db";

export interface IOrderItemDB extends IBaseDb<OrderItem>{}