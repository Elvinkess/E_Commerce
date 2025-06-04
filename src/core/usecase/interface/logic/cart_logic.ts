import { addItemCartReq } from "../../../domain/dto/requests/cart_request";
import { CartResponse } from "../../../domain/dto/responses/product_cart_response";
import { Cart } from "../../../domain/entity/cart";

export interface ICartLogic{
create(cart:Cart):Promise<Cart>
get(userId:number):Promise< CartResponse | null>
delete(cartId:number):Promise<Cart>
}