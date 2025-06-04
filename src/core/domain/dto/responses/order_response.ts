import { Cart } from "../../entity/cart";
import { Order } from "../../entity/order";
import { OrderItem } from "../../entity/order_item";
import { ProductResponse } from "./product_response";

export class OrderItemResponse extends OrderItem{
    product?:ProductResponse
}

export class OrderResponse extends Order{
    
    Order_items!:OrderItemResponse[]

}