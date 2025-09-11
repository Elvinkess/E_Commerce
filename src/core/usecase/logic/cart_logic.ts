import { addItemCartRequest } from "../../domain/dto/requests/add_cart_item";
import { RemoveCartItem } from "../../domain/dto/requests/remove_cart_item";
import { UpdateCartItem } from "../../domain/dto/requests/update_cart_item";
import { CartItemResponse, CartResponse, productInCartRes } from "../../domain/dto/responses/product_cart_response";
import { Cart } from "../../domain/entity/cart";
import { CartItem } from "../../domain/entity/cart_item";
import { cart_status } from "../../domain/enums/cart_status_enum";
import { ICartCache } from "../interface/data_access/cart_cache_db";
import { ICartDB } from "../interface/data_access/cart_db";
import { ICartItemDB } from "../interface/data_access/cart_item_db";
import { IInventoryDB } from "../interface/data_access/inventory_db";
import { IProductDB } from "../interface/data_access/product_db";
import { IUserDb } from "../interface/data_access/user_db";
import { ICartLogic } from "../interface/logic/cart_logic";
import { IProductLogic } from "../interface/logic/product_logic";


export class CartLogic implements ICartLogic{
    constructor(private cartDB: ICartDB,private userDB:IUserDb,private  cartItemDB:ICartItemDB,private productDB:IProductDB,private productlogic:IProductLogic,  private cartCache: ICartCache,private inventoryDB:IInventoryDB ){

    }
    get= async (userId:number): Promise< CartResponse | null>=>{
      //hit the redis server to get cart before the DB
      const cachedCart = await this.cartCache.getCartResponse(userId);
      if (cachedCart) {
        return cachedCart;
      }
      
        let activeCart =   await this.cartDB.getOne({user_id:userId,user_status:cart_status.ACTIVE})
        if(!activeCart){
          throw new Error("no cart found")
        }
               
        let cartItems =  await this.cartItemDB.get({cart_id:activeCart?.id}) 
        let productsInCartItems =await this.productDB.comparisonSearch({_in:{id:cartItems.map(item => item.product_id)}})
        let cartProducts  = await this.productlogic.convertProductsToProductResponsesEfficient (productsInCartItems)
        
          let cartItemResponses = cartItems.map((cartItem) => {
          let product = cartProducts.find((prod) => prod.id === cartItem.product_id);
          let cartItemResponse = new CartItemResponse(cartItem);  //convert cartItem to CartItemResponse to enrich it with all its fields
          cartItemResponse.product = product;
          cartItemResponse.updateCartItemStatus();
          return cartItemResponse;
        });
        const response: CartResponse = {
          ...activeCart,
          cart_items: cartItemResponses,
        };
        
        // save the  CartResponse to redis server for efficiency sake, incase this endpoint is called again,  it does not hit the DB.
        await this.cartCache.setCartResponse(userId, response);
        return response

    }

    addItemToCart = async (req: addItemCartRequest): Promise<CartResponse> => {
      let user = await this.userDB.get({ id: req.user_id });
      if (!user.length) throw new Error("User does not exist");
    
      let product = await this.productDB.getOne({ id: req.product_id });
      if (!product) throw new Error("Product does not exist");
    
      let productInventory = await this.inventoryDB.getOne({ id: product.inventory_id });
      if (!productInventory) throw new Error("Product inventory not found");
    
      let cart = await this.cartDB.getOne({ user_id: req.user_id, user_status: cart_status.ACTIVE });
      if (!cart) {
        let newCart = new Cart(req.user_id, [], cart_status.ACTIVE);
        cart = await this.cartDB.save(newCart);
      }
    
      let existingItem = await this.cartItemDB.getOne({cart_id: cart.id, product_id: req.product_id});
    
      let totalQuantity = existingItem ? existingItem.quantity + req.quantity : req.quantity;
      if (totalQuantity > productInventory.quantity_available) {
        throw new Error("Not enough inventory available");
      }
    
      if (existingItem) {
        await this.cartItemDB.update({ id: existingItem.id }, { quantity: totalQuantity });
      } else {
        const cartItem = new CartItem(cart.id, req.product_id, product.price, req.quantity);
        await this.cartItemDB.save(cartItem);
      }
    
      await this.cartCache.clearCart(req.user_id);
    
      const updatedCart = await this.get(req.user_id);
      if (!updatedCart) throw new Error("Failed to retrieve updated cart");
    
      return updatedCart;
    };
    
    updateCartItem = async(req: UpdateCartItem): Promise<CartResponse>=> {
      const userId = Number(req.userId)
      const productId = Number(req.productId)
      
      const cart = await this.cartDB.getOne({user_id:userId,user_status:cart_status.ACTIVE})
      if(!cart){throw new Error("cart not found")}

      const cartItem = await this.cartItemDB.getOne({cart_id:cart.id,product_id:productId})
      if(!cartItem){throw new Error("cart item not found")}

      await this.cartItemDB.update({id:cartItem.id},{quantity:req.quantity})
      await this.cartCache.clearCart(userId);

      const updatedCart = await this.get(userId);
      if (!updatedCart) throw new Error("Failed to retrieve updated cart");

      return updatedCart;

    }
    

    removeItemFromCart = async (req: RemoveCartItem): Promise<CartResponse> => {
      const { userId, productId } = req;
    
      // Step 1: Get active cart for this user
      const cart = await this.cartDB.getOne({
        user_id: userId,
        user_status: cart_status.ACTIVE
      });
      if (!cart) throw new Error("Cart does not exist");
    
      // Step 2: Check if product is in cart
      const cartItem = await this.cartItemDB.getOne({
        cart_id: cart.id,
        product_id: productId
      });
      if (!cartItem) throw new Error("Product not found in cart");
    
      // Step 3: Remove item completely
      await this.cartItemDB.remove({ id: cartItem.id });
    
      // Step 4: Clear cache and return updated cart
      await this.cartCache.clearCart(userId);
      const updatedCart = await this.get(userId);
      if (!updatedCart) throw new Error("Failed to retrieve updated cart");
    
      return updatedCart;
    };
    
  
    
    
  delete  = async  (userId: number): Promise<Cart> =>{

    let cart = await  this.cartDB.getOne({user_id:userId,user_status:cart_status.ACTIVE});
    if(!cart){ throw new Error("There's no active  cart")}
    let cartToRemove = await this.cartDB.remove({id:cart.id})
    await this.cartCache.clearCart(cart.user_id); // Clears the redit server from serfing same cart if it was present 
    return cartToRemove
  }
}