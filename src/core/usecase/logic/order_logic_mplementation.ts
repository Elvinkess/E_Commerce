import { CreateOrderPaymentresponse } from "../../domain/dto/responses/order_payment_responses";
import { OrderHistoryResponse, OrderItemResponse, OrderResponse } from "../../domain/dto/responses/order_response";
import { CartItemStatus } from "../../domain/dto/responses/product_cart_response";
import { delivery_status } from "../../domain/entity/delivery";
import { Order } from "../../domain/entity/order";
import { OrderItem } from "../../domain/entity/order_item";
import { OrderPayment } from "../../domain/entity/order_payment";
import { cart_status } from "../../domain/enums/cart_status_enum";
import { OrderStatus } from "../../domain/enums/order_items";
import { paymentStatus } from "../../domain/enums/payment_status_enums";
import { ICartCache } from "../interface/data_access/cart_cache_db";
import { ICartDB } from "../interface/data_access/cart_db";
import { IDeliveryDB } from "../interface/data_access/delivery_db";
import { IInventoryDB } from "../interface/data_access/inventory_db";
import { IOrderDB } from "../interface/data_access/order_db";
import { IOrderItemDB } from "../interface/data_access/order_item_db";
import { IOrderPaymentDB } from "../interface/data_access/order_payment_db";
import { IProductDB } from "../interface/data_access/product_db";
import { IUserDb } from "../interface/data_access/user_db";
import { ICartLogic } from "../interface/logic/cart_logic";
import { CreateDeliveryRequest, IDeliveryLogic } from "../interface/logic/delivery_logic";
import { IOrderLogic } from "../interface/logic/order_logic";
import { IPaymentLogic } from "../interface/logic/payment_logic";
import { BadRequestError } from "../utilities/Errors/bad_request";
import { NotFoundError } from "../utilities/Errors/not_found_request";
import { RandomUtility } from "../utilities/random_utility";

export class OrderLogic implements IOrderLogic{
    constructor(private orderDB:IOrderDB,private orderItemDB:IOrderItemDB,private  cartDB:ICartDB,private productDB:IProductDB,private userDB:IUserDb,private cartLogic:ICartLogic,private inventoryDB:IInventoryDB,private deliveryLogic:IDeliveryLogic,private paymentLogic:IPaymentLogic,private orderPaymentDB:IOrderPaymentDB,private deliveryDB:IDeliveryDB,private cartCache:ICartCache){
        
    }
    getOrderHistory = async (userId: number): Promise<OrderHistoryResponse[]> => {
      // get all orders for the user
      const orders = await this.orderDB.comparisonSearch({query:{user_id: userId },_not:{status:OrderStatus.PENDING} });
    
      const orderResponses: OrderHistoryResponse[] = [];
    
      for (const order of orders) {
        const orderItems = await this.orderItemDB.get({ order_id: order.id });
        
        // attach product info if
        const enrichedItems = await Promise.all(
          orderItems.map(async (item) => {
            const product = await this.productDB.getOne({ id: item.product_id });
            return { ...item,  product: product ?? undefined } as OrderItemResponse;
          })
        );
    
        // fetch payment info for this order
        const payment = await this.orderPaymentDB.getOne({ orderId: order.id });
    
        // build OrderHistoryResponse
        const historyResponse: OrderHistoryResponse = {
          ...order,
          status: payment?.status ?? order.status, // fallback to order.status
          date: (payment?.date)?.toString() ?? "",
          totalAmountPaid: payment?.amount! + payment?.deliveryamount!,
          transactionRef: payment?.transactionReference ?? "",
          Order_items: enrichedItems,
        };
    
        orderResponses.push(historyResponse);
      }

    
      return orderResponses.reverse();
    };
    
    



    get = async (userId: number|null,guestId:string|null): Promise<OrderResponse> => {
      if(!userId && !guestId){throw new BadRequestError("Either of userId or guestId must be available")}

      let totalAmount = 0;
      let orderedItems: OrderItemResponse[] = [];
    
      let cart =  await this.cartLogic.get(userId,guestId) 
    
      // Get existing order
      const existingOrder = userId ? await this.orderDB.getOne({user_id: userId, status: OrderStatus.PENDING}) :await this.orderDB.getOne({guest_id:guestId, status: OrderStatus.PENDING})

      //create new order if either of useId or guestId is available
      const savedOrder = existingOrder ?? await this.orderDB.save(new Order(userId,guestId,totalAmount,OrderStatus.PENDING)) 
    
      // Get existing order items
      const existingOrderItems = await this.orderItemDB.get({order_id: savedOrder.id});
    
      // Map existing items by product id for quick lookup
      const existingItemsMap = new Map<number, OrderItemResponse>();
      for (let item of existingOrderItems) {
        existingItemsMap.set(item.product_id, item);
      }
    
      // Go through cart items and add missing items to order
      for (let cartItem of cart?.cart_items ?? []) {
        const product = cartItem.product;
        const prodStatus = cartItem.status;
        const date = new Date().toISOString();
    
        if (!product) continue;
    
        // If item already in order, just use it
        if (existingItemsMap.has(product.id)) {
          const existingItem = existingItemsMap.get(product.id)!;
          orderedItems.push(existingItem);
          totalAmount += existingItem.price;
          continue;
        }
    
        // Add new order item based on cart
        let savedOrderedItem: OrderItemResponse;
        if (prodStatus === CartItemStatus.Okay) {
          savedOrderedItem = await this.orderItemDB.save(
            new OrderItem(savedOrder.id, product.id, product.name, cartItem.quantity, cartItem.quantity * product.price, date)
          ) as OrderItemResponse;
        } else if (prodStatus === CartItemStatus.LessQuantity) {
          const quantityAvailable = Math.max(product.inventory?.quantity_available ?? 0, 0);
          const message = "Quantity desired not available, we gave you all we got!";
          savedOrderedItem = await this.orderItemDB.save(
            new OrderItem(savedOrder.id, product.id, product.name, quantityAvailable, quantityAvailable * product.price, date, message)
          ) as OrderItemResponse;
        } else {
          continue;
        }
    
        savedOrderedItem.product = product;
        orderedItems.push(savedOrderedItem);
        totalAmount += savedOrderedItem.price;
      }
    
      // Update total price
      await this.orderDB.update({id: savedOrder.id}, {total_price: totalAmount});
    
      // Return order response
      const orderResponse = savedOrder as OrderResponse;
      orderResponse.Order_items = orderedItems;
      orderResponse.total_price = totalAmount;
    
      return orderResponse;
    }
    

    remove = async (orderId: number, userId: number | null, guestId: string | null): Promise<string> => {
      // validate userId and guestId
      if (!userId && !guestId) {
        throw new BadRequestError("Either userId or guestId must be available");
      }
      let order;

      if (userId) {
        // check user exists
        const user = await this.userDB.getOne({ id: userId });
        if (!user) throw new NotFoundError("User does not exist");
    
        // fetch order belonging to user
        order = await this.orderDB.getOne({ id: orderId, user_id: userId });
      } else if (guestId) {
        // fetch order belonging to guest
        order = await this.orderDB.getOne({ id: orderId, guest_id: guestId });
      }
    
      if (!order) {
        throw new NotFoundError("Order does not exist or does not belong to this account");
      }
    
      if (order.status !== OrderStatus.PENDING) {
        throw new BadRequestError("Only pending orders can be removed");
      }
    
      // remove associated records
      await this.orderItemDB.removeMany({ order_id: orderId });
      await this.orderPaymentDB.removeMany({ orderId: orderId });
      await this.deliveryDB.removeMany({ orderid: orderId });
      await this.orderDB.remove({ id: orderId });
    
      return "Order successfully removed";
    };
    
    
 
    

    payForOrder = async(orderId:number,guestEmail?:string):Promise<CreateOrderPaymentresponse> =>{
        let order = await this.orderDB.getOne({id:orderId})
        if(!order){throw new NotFoundError("ORDER not found!!");}
        if(order.status === OrderStatus.PAID){throw new BadRequestError("User already paid")}

        let user = order.user_id ? await this.userDB.getOne({ id: order.user_id }) : null;

       // Validate that either user exists OR guestId+guestEmail is provided
        if (!user) {
         if (!order.guest_id || !guestEmail) {
            throw new BadRequestError("Order must belong to a registered user or have a valid guest with email");
         }
       }

     
        let date = new Date()
        let transactionReference  = RandomUtility.generateRandomString(15)
        let deliveryDate = (await this.deliveryLogic.getDeliveryDate(order))

        let deliveryreq:CreateDeliveryRequest = {
          orderId:order.id,
          pickUpDate:deliveryDate,
          deliveryInstructions:"Please deliver on time",
          orderDetails: await this.get(order.user_id,order.guest_id)
        }

        //Creating Shippment
       let shipment = await this.deliveryLogic.getDeliveryFee(deliveryreq)
       
       let deliveryFee = Math.round(parseFloat(`${shipment.data.fastest_courier.total + (shipment.data.fastest_courier.total * 0.2)}`)); 
        const Email= user ? user.email : guestEmail!
        let payment = new OrderPayment({amount:order.total_price ,status:paymentStatus.PENDING,orderId:order.id,userEmail:Email,date:date,transactionReference:transactionReference,deliveryamount:deliveryFee})
        let savedOrderpayment = await this.orderPaymentDB.getOne({transactionReference:transactionReference}) ?? await this.orderPaymentDB.save(payment)
        let Orderpayment = await this.paymentLogic.initiatePayforOrder(savedOrderpayment)
        return Orderpayment
    }
    



    processCompletedPaymentForOrder = async(transactionRef:string):Promise<any> =>{

        let payment = await this.orderPaymentDB.getOne({transactionReference:transactionRef});
        if(payment === null){throw new BadRequestError("There is no initiated payment for this order")}
        let order = await this.orderDB.getOne({id:payment?.orderId});
        
        if(payment?.status == paymentStatus.PAID ){  throw new BadRequestError(`This payment with transactionRef: ${transactionRef} has been paid and completed`)}
        let totalAmount = payment.amount + payment.deliveryamount
        
        
        let confirmPayment = await this.paymentLogic.confirmPayment(transactionRef,totalAmount);
                
        let updatedOrderPayment = await this.orderPaymentDB.update({id:payment?.id},{processorReference:confirmPayment.processor_response,status:paymentStatus.PAID,remarks:confirmPayment.status})
        
        if(!order){throw new NotFoundError("ORDER not found!!");}
        if(order.status === OrderStatus.PAID){throw new BadRequestError("User already paid")}
        let deliveryDate = await this.deliveryLogic.getDeliveryDate(order)
      

        let deliveryreq:CreateDeliveryRequest ={
          orderId:order.id,
          pickUpDate:deliveryDate,
            deliveryInstructions:"Please deliiver on time",
            orderDetails: await this.get(order.user_id,order.guest_id)
          }
        let shipment =await this.deliveryLogic.createDelivery(deliveryreq)


        // INVENTORY UPDATE DATA
        
        let orderedItems  = await this.orderItemDB.get({order_id:order?.id})

      
        for (let i = 0; i < orderedItems.length; i++) {
          let product = await this.productDB.getOne({ id: orderedItems[i].product_id });
          let inventory = await this.inventoryDB.getOne({ id: product?.inventory_id });
        
          let qAvailable = (inventory?.quantity_available ?? 0) - orderedItems[i].quantity;
          let qSold = (inventory?.quantity_sold ?? 0) + orderedItems[i].quantity;
        
          await this.inventoryDB.update(
            { id: product?.inventory_id },
            { quantity_available: qAvailable, quantity_sold: qSold }
         );
        }
        
        await this.cartCache.clearCart(order.user_id,order.guest_id);
       
        const where: any = { user_status: cart_status.ACTIVE };

        if (order.user_id) {
          where.user_id = order.user_id;
        }

        if (order.guest_id) {
          where.guest_id = order.guest_id;
        }
        await this.cartDB.update(where, { user_status: cart_status.INACTIVE });

        await this.orderDB.update({ id: order?.id }, { status: OrderStatus.PAID });
        await this.deliveryDB.update({ orderid: order?.id }, { status: delivery_status.PAID });
        


      return updatedOrderPayment
    }

} 













                