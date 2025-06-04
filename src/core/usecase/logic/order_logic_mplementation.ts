import { CreateOrderPaymentresponse } from "../../domain/dto/responses/order_payment_responses";
import { OrderItemResponse, OrderResponse } from "../../domain/dto/responses/order_response";
import { CartItemStatus } from "../../domain/dto/responses/product_cart_response";
import { delivery_status } from "../../domain/entity/delivery";
import { inventory } from "../../domain/entity/inventory";
import { Order } from "../../domain/entity/order";
import { OrderItem } from "../../domain/entity/order_item";
import { OrderPayment } from "../../domain/entity/order_payment";
import { cart_status } from "../../domain/enums/cart_status_enum";
import { OrderStatus } from "../../domain/enums/order_items";
import { paymentStatus } from "../../domain/enums/payment_status_enums";
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
import { RandomUtility } from "../utilities/random_utility";

export class OrderLogic implements IOrderLogic{
    constructor(private orderDB:IOrderDB,public orderItemDB:IOrderItemDB,public  cartDB:ICartDB,private productDB:IProductDB,private userDB:IUserDb,public cartLogic:ICartLogic,public inventoryDB:IInventoryDB,public deliveryLogic:IDeliveryLogic,public paymentLogic:IPaymentLogic,public orderPaymentDB:IOrderPaymentDB,public deliveryDB:IDeliveryDB){
        
    }
    get = async (userId: number): Promise<OrderResponse> => {
        
        let totalAmount = 0;
        let orderedItems :  OrderItem[] = []
        
        let cart = await this.cartLogic.get(userId);
        


        // return existing order if any is available esle  create a new one
        let existingOrder = await  this.orderDB.getOne({user_id:userId,status:OrderStatus.PENDING})
        // if(existingOrder){
        //   return existingOrder as OrderResponse
        // }
        let savedOrder = existingOrder ??  await this.orderDB.save(new Order(userId,totalAmount,OrderStatus.PENDING)) 

        let OrderItems = await  this.orderItemDB.get({order_id:savedOrder.id})
        if(OrderItems.length !== 0){
          totalAmount = OrderItems.reduce((acc, item) => acc + item.price, 0);
          orderedItems = OrderItems

        }else{

          for(let cartItem  of cart?.cart_items  ?? []){
            let product = cartItem.product
            let prodStatus = cartItem.status
            let date =  new Date().toISOString();


            if(prodStatus === CartItemStatus.Okay && product){             
              let savedOrderedItem = ( await this.orderItemDB.save(new OrderItem(savedOrder.id,product.id,cartItem.quantity,cartItem.quantity*product.price,`${date}`))) as OrderItemResponse 
              //get  all ordereditems with orderId 
              savedOrderedItem.product = cartItem.product
              orderedItems.push(savedOrderedItem)
              totalAmount += savedOrderedItem.price 
                
              


            }else if (prodStatus === CartItemStatus.LessQuantity && product){

                let message = "Quantity desired not available hence we gave you all we got hurray!"
                let quantityAvailable = Math.max((cartItem.product?.inventory?.quantity_available ?? 0),0)
                let orderItem =  new OrderItem(savedOrder.id,product.id,quantityAvailable,quantityAvailable * product.price,`${date}`,message)
                let savedOrderedItem = await this.orderItemDB.save(orderItem) as OrderItemResponse
                savedOrderedItem.product = cartItem.product
                orderedItems.push(savedOrderedItem)
                totalAmount += orderItem.price 

              
            }
        }
      }
        let updatedOrder = await  this.orderDB.update({id:savedOrder.id},{total_price:totalAmount})
        let orderResponse = savedOrder as OrderResponse
        orderResponse.Order_items = orderedItems
        orderResponse.total_price = totalAmount
        return orderResponse
    }
    

    payForOrder = async(orderId:number):Promise<CreateOrderPaymentresponse> =>{

        let order = await this.orderDB.getOne({id:orderId})
        if(!order){throw new Error("ORDER not found!!");}
        if(order.status === OrderStatus.PAID){throw new Error("User already paid")}

        let user = await this.userDB.getOne({id:order?.user_id})
        if(!user){ throw new Error("USER  not found!!")};
        let date = new Date()
        let transactionReference  = RandomUtility.generateRandomString(15)
        let deliveryDate = (await this.deliveryLogic.getDeliveryDate(order))

        let deliveryreq:CreateDeliveryRequest = {
            orderId:order.id,
            pickUpDate:deliveryDate,
             deliveryInstructions:"Please deliiver on time",
             orderDetails: await this.get(user.id)
        }

        //Creating Shippment
       let shipment = await this.deliveryLogic.getDeliveryFee(deliveryreq)
       
       let deliveryFee = Math.round(parseFloat(`${shipment.data.fastest_courier.total + (shipment.data.fastest_courier.total * 0.2)}`)); 
       
        let payment = new OrderPayment({amount:order.total_price ,status:paymentStatus.PENDING,orderId:order.id,userEmail:user.email,date:date,transactionReference:transactionReference,deliveryamount:deliveryFee})
        let savedOrderpayment = await this.orderPaymentDB.getOne({transactionReference:transactionReference}) ?? await this.orderPaymentDB.save(payment)
        let Orderpayment = await this.paymentLogic.initiatePayforOrder(savedOrderpayment)
        return Orderpayment
    }
    



    processCompletedPaymentForOrder = async(transactionRef:string):Promise<any> =>{

        let payment = await this.orderPaymentDB.getOne({transactionReference:transactionRef});
        if(payment === null){throw new Error("There is no initiated payment for this order")}
        let order = await this.orderDB.getOne({id:payment?.orderId});

        if(payment?.status == paymentStatus.PAID ){  throw Error(`This payment with transactionRef: ${transactionRef} has been paid and completed`)}
        let totalAmount = payment.amount + payment.deliveryamount
        
        
        let confirmPayment = await this.paymentLogic.confirmPayment(transactionRef,totalAmount);
                
        let updatedOrderPayment = await this.orderPaymentDB.update({id:payment?.id},{processorReference:confirmPayment.processor_response,status:paymentStatus.PAID,remarks:confirmPayment.status})
        
        if(!order){throw new Error("ORDER not found!!");}
        if(order.status === OrderStatus.PAID){throw new Error("User already paid")}
        let deliveryDate = await this.deliveryLogic.getDeliveryDate(order)
        let user = await this.userDB.getOne({id:order?.user_id})
        if(!user){ throw new Error("USER  not found!!")};

        let deliveryreq:CreateDeliveryRequest ={
          orderId:order.id,
          pickUpDate:deliveryDate,
            deliveryInstructions:"Please deliiver on time",
            orderDetails: await this.get(user.id)
          }
        let shipment =await this.deliveryLogic.createDelivery(deliveryreq)
        console.log("SHIPMENT HAS BEGAN")


        // INVENTORY UPDATE DATA
        
        let orderedItems  = await this.orderItemDB.get({order_id:order?.id})

        for(let i=0; i < orderedItems.length ; i++){
          
            let product =  await this.productDB.getOne({id:orderedItems[i].product_id})
            let inventory =  await this.inventoryDB.getOne({id:product?.inventory_id})
            let qAvailable = (inventory?.quantity_available ?? 0) - orderedItems[i].quantity
            let qSold = (inventory?.quantity_sold ?? 0) +  orderedItems[i].quantity
            
            //UPDATE CART,ORDER AND INVENTORY
            let updatedInventory =  await this.inventoryDB.update({id:product?.inventory_id},{quantity_available:qAvailable,quantity_sold:qSold})  
            await this.cartDB.update({user_id:order?.user_id,user_status:cart_status.ACTIVE},{user_status:cart_status.INACTIVE});  
            await this.orderDB.update({id:order?.id},{status:OrderStatus.PAID});
            await this.deliveryDB.update({orderid:order?.id},{status:delivery_status.PAID})
            console.log(updatedInventory)  
        }


      return updatedOrderPayment
    }

} 











     // payForOrder = async(userId:number){
        //     //find active user order based on userID,just call get 
        //     //get the total price from the order
        //     //call payment gateway to create a payment session for the userId to pay
        // }

        // completeOrder = async(){
        //     //gets a feedback from payment gateway
        //     //if payment is successful mark the orderstatus as completed
        // }


                         //update inventory do this when the payment is successful
                 //let qAvailable = (product.inventory?.quantity_available ?? 0)  - cartItem.quantity
                // let qSold = (product.inventory?.quantity_sold ?? 0) + cartItem.quantity
                 //let updatedInventory = await this.inventoryDB.update({id:product.inventory_id},{quantity_available:qAvailable,quantity_sold:qSold});
                 //cartItem.product!.inventory = updatedInventory
                // console.log(updatedInventory)

                