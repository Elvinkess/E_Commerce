import redisClient from "../../../api/redis/connection";
import { CartResponse } from "../../domain/dto/responses/product_cart_response";
import { ICartCache } from "../../usecase/interface/data_access/cart_cache_db";


export class RedisCartCache implements ICartCache {
    private key(userId: number | null,guestId:string | null): string {
      if(userId !== null)  return `cart:response:user:${userId}`;
      if(guestId !== null) return `cart:response:guest:${guestId}`;
      throw new Error("Either userId or guestId must be provided");
    }
  
    getCartResponse = async(userId: number|null,guestId:string|null): Promise<CartResponse | null> =>{
      const data = await redisClient.get(this.key(userId,guestId));
      return data ? JSON.parse(data) : null;
    }
  
    setCartResponse = async(response: CartResponse,userId: number|null,guestId:string|null): Promise<void> =>{
      await redisClient.set(this.key(userId,guestId), JSON.stringify(response), {
        EX: 60 * 60 * 24, // expire after 24 hours
      });
    }
  
    clearCart = async(userId: number |null,guestId:string | null): Promise<void> =>{
      await redisClient.del(this.key(userId,guestId));
    }
  }