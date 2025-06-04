import { OrderPayment } from "../../../domain/entity/order_payment";
import { IBaseDb } from "./base_db";


export interface IOrderPaymentDB extends IBaseDb<OrderPayment>{}