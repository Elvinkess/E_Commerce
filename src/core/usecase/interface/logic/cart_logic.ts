import { addItemCartRequest } from "../../../domain/dto/requests/add_cart_item";
import { RemoveCartItem } from "../../../domain/dto/requests/remove_cart_item";
import { UpdateCartItem } from "../../../domain/dto/requests/update_cart_item";
import { CartResponse } from "../../../domain/dto/responses/product_cart_response";
import { Cart } from "../../../domain/entity/cart";

export interface ICartLogic{
get(userId:number | null,guestId:string | null):Promise< CartResponse | null>
delete(userId:number|null,guestId:string |null):Promise<Cart>
addItemToCart  (req: addItemCartRequest): Promise<CartResponse >
removeItemFromCart (req:RemoveCartItem): Promise<CartResponse> 
updateCartItem(req:UpdateCartItem):Promise<CartResponse>
mergeCart(userId:number | null,guestId:string | null):Promise<CartResponse|null>
}