import { CartItem } from "../../../domain/entity/cart_item";
import { IBaseDb } from "./base_db";

export interface ICartItemDB extends IBaseDb<CartItem>{}