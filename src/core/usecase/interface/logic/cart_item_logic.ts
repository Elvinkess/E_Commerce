import { CartItem } from "../../../domain/entity/cart_item"

export interface ICartItemLogic{
    create(cartItem:CartItem): Promise<CartItem>
    delete(cartItemId:number):Promise<CartItem>

}