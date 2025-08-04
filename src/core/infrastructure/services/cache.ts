import redisClient from "../../../api/redis/connection";
import { CartResponse } from "../../domain/dto/responses/product_cart_response";
import { ICartCache } from "../../usecase/interface/data_access/cart_cache_db";


export class RedisCartCache implements ICartCache {
    private key(userId: number): string {
      return `cart:response:user:${userId}`;
    }
  
    getCartResponse = async(userId: number): Promise<CartResponse | null> =>{
      const data = await redisClient.get(this.key(userId));
      return data ? JSON.parse(data) : null;
    }
  
    setCartResponse = async(userId: number, response: CartResponse): Promise<void> =>{
      await redisClient.set(this.key(userId), JSON.stringify(response), {
        EX: 60 * 60 * 24, // expire after 24 hours
      });
    }
  
    clearCart = async(userId: number): Promise<void> =>{
      await redisClient.del(this.key(userId));
    }
  }