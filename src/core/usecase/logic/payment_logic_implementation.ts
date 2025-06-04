import { CreateOrderPaymentresponse } from "../../domain/dto/responses/order_payment_responses";
import { OrderPayment } from "../../domain/entity/order_payment";
import { paymentStatus } from "../../domain/enums/payment_status_enums";
import { IOrderDB } from "../interface/data_access/order_db";
import { IOrderPaymentDB } from "../interface/data_access/order_payment_db";
import { IUserDb } from "../interface/data_access/user_db";
import { IPaymentLogic } from "../interface/logic/payment_logic";
import { IPaymentService } from "../interface/services/payment_service";
import { RandomUtility } from "../utilities/random_utility";
import { OrderStatus } from "../../domain/enums/order_items";
import { delivery_status } from "../../domain/entity/delivery";
import { IDeliveryDB } from "../interface/data_access/delivery_db";
import { ICartDB } from "../interface/data_access/cart_db";
import { cart_status } from "../../domain/enums/cart_status_enum";
import { IInventoryDB } from "../interface/data_access/inventory_db";
import { IOrderItemDB } from "../interface/data_access/order_item_db";
import { IProductDB } from "../interface/data_access/product_db";
import { IDeliveryLogic } from "../interface/logic/delivery_logic";
import { confirmPaymentResponse, FlwConfirmPaymentRes } from "../../domain/dto/responses/payment_service_responses/flw_confirm_payment_res";



export class Paymentlogic implements IPaymentLogic{
    constructor(private orderDB:IOrderDB,private userDB:IUserDb,private orderPaymentDB:IOrderPaymentDB,private paymentService:IPaymentService,public deliveryDB:IDeliveryDB,public cardDB:ICartDB,public inventoryDB:IInventoryDB,public orderItemDB:IOrderItemDB,public  productDB:IProductDB,public deliveryLogic:IDeliveryLogic){

    }
    initiatePayforOrder  = async (payment: OrderPayment): Promise<CreateOrderPaymentresponse> => {

        let savedPaymentOrder = await this.orderPaymentDB.getOne({id:payment.id}) ?? await this.orderPaymentDB.save(payment)
        
        let initiatedPayment = await this.paymentService.initiatePayment(savedPaymentOrder);
        return initiatedPayment

    }

    confirmPayment = async (transactionRef:string,totalAmount:number):Promise<confirmPaymentResponse> =>{

        let confirmPayment = await this.paymentService.confirmPayment(transactionRef);
        
        console.log(confirmPayment,"this is the confirmpayment")
        if (confirmPayment === null){throw new Error()}
        else if(confirmPayment.status !== "success"){    throw new Error(confirmPayment.message)}
        else if(totalAmount  !== confirmPayment.data?.amount){throw new Error("you paid: " +confirmPayment.data?.amount + " instead of :" + totalAmount)}
        else if(confirmPayment.data?.currency !=="NGN"){throw new Error("The currency you paid with isn't NGN")}
        else if(confirmPayment.data.status === "successful"){return confirmPayment.data} 
        else throw new Error("Payment not successful")
        

    }

   
}




  
    // processCompletedPaymentForOrder = async(transactionRef:string):Promise<any> =>{

    //     let payment = await this.orderPaymentDB.getOne({transactionReference:transactionRef});
    //     if(payment === null){throw new Error("There is no initiated payment for this order")}
    //     let order = await this.orderDB.getOne({id:payment?.orderId});

    //     if(payment?.status == paymentStatus.PAID ){  throw Error(`This payment with transactionRef: ${transactionRef} has been paid and completed`)}
    //     let totalAmount = payment.amount + payment.deliveryamount
        
    //     let confirmPayment = await this.paymentService.confirmPayment(transactionRef);
        
    //     console.log(confirmPayment,"this is the confirmpayment")
    //     if (confirmPayment === null){throw new Error()}
    //     else if(confirmPayment.status !== "success"){    throw new Error(confirmPayment.message)}
    //     else if(totalAmount  !== confirmPayment.data?.amount){throw new Error("you paid: " +confirmPayment.data?.amount + " instead of :" + totalAmount)}
    //     else if(confirmPayment.data?.currency !=="NGN"){throw new Error("The currency you paid with isn't NGN")}
    //     else if(confirmPayment.data.status === "successful"){

    //         let updatedOrderPayment = await this.orderPaymentDB.update({id:payment?.id},{processorReference:confirmPayment.data.processor_response,status:paymentStatus.PAID,remarks:confirmPayment.data.status})
    //         await this.cardDB.update({user_id:order?.user_id,user_status:cart_status.ACTIVE},{user_status:cart_status.INACTIVE});  
    //         await this.orderDB.update({id:order?.id},{status:OrderStatus.PAID});
    //           await this.deliveryDB.update({orderid:order?.id},{status:delivery_status.PAID})
    //           await this.deliveryLogic.createDelivery()
              
    //           let orderedItems  = await this.orderItemDB.get({order_id:order?.id})

    //           for(let i=0; i < orderedItems.length ; i++){

    //             let product =  await this.productDB.getOne({id:orderedItems[i].product_id})
    //             let inventory =  await this.inventoryDB.getOne({id:product?.inventory_id})
    //             let qAvailable = (inventory?.quantity_available ?? 0) - orderedItems[i].quantity
    //             let qSold = (inventory?.quantity_sold ?? 0) +  orderedItems[i].quantity
               
    //             let updatedInventory =  await this.inventoryDB.update({id:product?.inventory_id},{quantity_available:qAvailable,quantity_sold:qSold})  
    //             console.log(updatedInventory)  
    //           }
              
    //            //update inventory do this when the payment is successful
    //            // let qSold = (product.inventory?.quantity_sold ?? 0) + quantityAvailable
    //            // let updatedInventory = await this.inventoryDB.update({id:product.inventory_id},{quantity_available:quantityAvailable,quantity_sold:qSold});
    //            // cartItem.product!.inventory = updatedInventory
    //            //console.log(updatedInventory)


    //           return updatedOrderPayment
    //     }

        
    // }


//get payment with transreference from orderPaymentDB
        //check if the orderPayment  status is paid or reverse throw an error or stop saying "this has been compled"
        //if not successful end
        //go to payment service to comfirm the status of this payment on the payment gateway or service
        //validate the amount and currency of the payment made to the payment service against Orderpayment saved on my DB
        //if everything is valid :
        //a. update this my orderPaymentDB with processorRef,status from gateway,remark and update my orderPayment status as well
        //b. get your Order and update the status to match the outcome of the transaction
        // return a response with the order and payment
        

        