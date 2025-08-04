import { CartResponse } from "../../../domain/dto/responses/product_cart_response";

export interface ICartCache {
    getCartResponse(userId: number): Promise<CartResponse | null>;
    setCartResponse(userId: number, response: CartResponse): Promise<void>;
    clearCart(userId: number): Promise<void>;
  }