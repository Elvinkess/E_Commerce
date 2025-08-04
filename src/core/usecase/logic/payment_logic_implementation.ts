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




  
