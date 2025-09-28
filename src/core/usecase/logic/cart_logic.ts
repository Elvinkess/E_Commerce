import { addItemCartRequest } from "../../domain/dto/requests/add_cart_item";
import { RemoveCartItem } from "../../domain/dto/requests/remove_cart_item";
import { UpdateCartItem } from "../../domain/dto/requests/update_cart_item";
import { CartItemResponse, CartResponse, productInCartRes } from "../../domain/dto/responses/product_cart_response";
import { Cart } from "../../domain/entity/cart";
import { CartItem } from "../../domain/entity/cart_item";
import { cart_status } from "../../domain/enums/cart_status_enum";
import { BadRequestError } from "../utilities/Errors/bad_request";
import { NotFoundError } from "../utilities/Errors/not_found_request";
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
 
    get= async (userId:number|null,guestId:string | null): Promise< CartResponse | null>=>{
      if(!userId && !guestId){throw new BadRequestError("Either of userId or guestId must be available")}
      //hit the redis server to get cart before the DB
      const cachedCart = await this.cartCache.getCartResponse(userId,guestId);
      if (cachedCart) {
        return cachedCart;
      }
        let activeCart = userId  ?  await this.cartDB.getOne({user_id:userId,user_status:cart_status.ACTIVE}) : await this.cartDB.getOne({ guest_id: guestId, user_status: cart_status.ACTIVE });

        if(!activeCart){
          throw new NotFoundError("No cart found")
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
        await this.cartCache.setCartResponse( response,userId,guestId);
        return response

    }

    addItemToCart = async (req: addItemCartRequest): Promise<CartResponse> => {

      // Validation: must have either user_id or guest_id
      if (!req.user_id && !req.guest_id) {throw new BadRequestError("Either user_id or guest_id must be provided");}

      // If logged-in user, check user existence
      if(req.user_id ){
        let user = await this.userDB.getOne({ id: req.user_id });
        if (!user) throw new NotFoundError("User does not exist");
      }
    
    //Validate product and inventory
      let product = await this.productDB.getOne({ id: req.product_id });
      if (!product) throw new NotFoundError("Product does not exist");
    
      let productInventory = await this.inventoryDB.getOne({ id: product.inventory_id });
      if (!productInventory) throw new NotFoundError("Product inventory not found");
    
      // find active cart(user or guest)
      let cart = req.user_id ? await this.cartDB.getOne({ user_id: req.user_id, user_status: cart_status.ACTIVE }) : await this.cartDB.getOne({ guest_id: req.guest_id, user_status: cart_status.ACTIVE })

      // if no active cart create a new one
      if (!cart) {
        let newCart = new Cart( [], cart_status.ACTIVE,req.user_id,req.guest_id);
        cart = await this.cartDB.save(newCart);
      }

      //check if item exist in cart
      let existingItem = await this.cartItemDB.getOne({cart_id: cart.id, product_id: req.product_id});
    
      let totalQuantity = existingItem ? existingItem.quantity + req.quantity : req.quantity;
      if (totalQuantity > productInventory.quantity_available) {
        throw new BadRequestError("Not enough inventory available");
      } 
    

      //Add or update item
      if (existingItem) {
        await this.cartItemDB.update({ id: existingItem.id }, { quantity: totalQuantity });
      } else {
        const cartItem = new CartItem(cart.id, req.product_id, product.price, req.quantity);
        await this.cartItemDB.save(cartItem);
      }
    
      await this.cartCache.clearCart(req.user_id,req.guest_id);
    
      const updatedCart = await this.get(req.user_id,req.guest_id);
      if (!updatedCart) throw new Error("Failed to retrieve updated cart");
    
      return updatedCart;
    };
    
    updateCartItem = async(req: UpdateCartItem): Promise<CartResponse>=> {
      if(!req.userId && !req.guestId){throw new BadRequestError ("Either of userId or guestId must be provided")}
      const productId = Number(req.productId)
      
      const cart = req.userId ? await this.cartDB.getOne({user_id:req.userId,user_status:cart_status.ACTIVE}) :await this.cartDB.getOne({guest_id:req.guestId,user_status:cart_status.ACTIVE}) 
      if(!cart){throw new NotFoundError("cart not found")}

      const cartItem = await this.cartItemDB.getOne({cart_id:cart.id,product_id:productId})
      if(!cartItem){throw new NotFoundError("cart item not found")}

      await this.cartItemDB.update({id:cartItem.id},{quantity:req.quantity})
      await this.cartCache.clearCart(req.userId,req.guestId);

      const updatedCart = await this.get(req.userId,req.guestId);
      if (!updatedCart) throw new Error("Failed to retrieve updated cart");
      await this.cartCache.clearCart(req.userId,req.guestId)

      return updatedCart;

    }
    

    removeItemFromCart = async (req: RemoveCartItem): Promise<CartResponse> => {
      const { userId,guestId, productId } = req;

      if(!userId && !guestId){throw new BadRequestError("Either of userId or guestId must be available")}
    
      // Step 1: Get active cart for this user
      const cart = userId ? await this.cartDB.getOne({user_id: userId,user_status: cart_status.ACTIVE}) : await this.cartDB.getOne({guest_id:guestId,user_status: cart_status.ACTIVE})
      if (!cart) throw new NotFoundError("Cart does not exist");
    
      // Step 2: Check if product is in cart
      const cartItem = await this.cartItemDB.getOne({
        cart_id: cart.id,
        product_id: productId
      });
      if (!cartItem) throw new NotFoundError("Product not found in cart");
    
      // Step 3: Remove item completely
      await this.cartItemDB.remove({ id: cartItem.id });
    
      // Step 4: Clear cache and return updated cart
      await this.cartCache.clearCart(userId,guestId);
      const updatedCart = await this.get(userId,guestId);
      if (!updatedCart) throw new Error("Failed to retrieve updated cart");
    
      return updatedCart;
    };
    
  delete  = async  (userId: number| null,guestId:string | null): Promise<Cart> =>{

    if(!userId && !guestId){throw new Error("Either of userId or guestId must be available")}

    let cart = userId ? await  this.cartDB.getOne({user_id:userId,user_status:cart_status.ACTIVE}) :  await  this.cartDB.getOne({guest_id:guestId,user_status:cart_status.ACTIVE})
    if(!cart){ throw new NotFoundError("There's no active  cart to delete")}
    let cartToRemove = await this.cartDB.remove({id:cart.id})
    await this.cartCache.clearCart(cart.user_id,guestId); // Clears the redit server from serfing same cart if it was present 
    return cartToRemove
  }




  mergeCart = async (userId: number | null, guestId: string | null): Promise<CartResponse | null> => {
    if (!userId || !guestId) { throw new BadRequestError("Both userId and guestId must be available")}
  
    //Fetch guest cart
    const guestCart = await this.cartDB.getOne({guest_id: guestId,user_status: cart_status.ACTIVE});
  
    if (!guestCart) return null; // nothing to merge
  
    const guestCartItems = await this.cartItemDB.get({ cart_id: guestCart.id });
  
    //Fetch or create user cart
    let userCart = await this.cartDB.getOne({user_id: userId,user_status: cart_status.ACTIVE});
  
    let userCartItems: CartItem[] = [];
  
    if (!userCart) {
      const cart = new Cart([], cart_status.ACTIVE, userId, null);
      userCart = await this.cartDB.save(cart);
    } else {
      userCartItems = await this.cartItemDB.get({ cart_id: userCart.id });
    }
  
    // Merge items
    for (const gItem of guestCartItems) {
      const existing = userCartItems.find(
        (uItem) => uItem.product_id === gItem.product_id
      );
  
      if (existing) {
        await this.cartItemDB.update(
          { id: existing.id },
          { quantity: existing.quantity + gItem.quantity }
        );
      } else {
        const newCartItem = new CartItem(userCart.id,gItem.product_id,gItem.purchased_price,gItem.quantity);
        await this.cartItemDB.save(newCartItem);
      }
    }
  
    //Clear guest cart
    await this.cartItemDB.removeMany({ cart_id: guestCart.id });
    await this.cartDB.update({ id: guestCart.id },{ user_status: cart_status.INACTIVE });
    await this.cartCache.clearCart(null, guestId);

  
    //Build response (same as get)
    const mergedCartItems = await this.cartItemDB.get({ cart_id: userCart.id });
    const productsInCartItems = await this.productDB.comparisonSearch({ _in: { id: mergedCartItems.map((item) => item.product_id) },
    });
  
    const cartProducts = await this.productlogic.convertProductsToProductResponsesEfficient(productsInCartItems);
  
    const cartItemResponses = mergedCartItems.map((cartItem) => {
      const product = cartProducts.find(
        (prod) => prod.id === cartItem.product_id
      );
      const cartItemResponse = new CartItemResponse(cartItem);
      cartItemResponse.product = product;
      cartItemResponse.updateCartItemStatus();
      return cartItemResponse;
    });
  
    const response: CartResponse = {
      ...userCart,
      cart_items: cartItemResponses,
    };
  
    // optional: cache the merged response
    await this.cartCache.setCartResponse(response, userId, null);
  
    return response;
  };
  
}