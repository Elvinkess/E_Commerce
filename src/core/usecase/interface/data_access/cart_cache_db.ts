import { CartResponse } from "../../../domain/dto/responses/product_cart_response";

export interface ICartCache {
    getCartResponse(userId: number | null,guestId:string | null): Promise<CartResponse | null>;
    setCartResponse(response: CartResponse,userId: number|null,guestId:string|null ): Promise<void>;
    clearCart(userId: number|null,guestId:string|null): Promise<void>;
  }