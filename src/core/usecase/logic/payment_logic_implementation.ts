import { CreateOrderPaymentresponse } from "../../domain/dto/responses/order_payment_responses";
import { OrderPayment } from "../../domain/entity/order_payment";
import { IOrderPaymentDB } from "../interface/data_access/order_payment_db";
import { IPaymentLogic } from "../interface/logic/payment_logic";
import { IPaymentService } from "../interface/services/payment_service";

import { confirmPaymentResponse, FlwConfirmPaymentRes } from "../../domain/dto/responses/payment_service_responses/flw_confirm_payment_res";
import { BadRequestError } from "../utilities/Errors/bad_request";



export class Paymentlogic implements IPaymentLogic{
    constructor(private orderPaymentDB:IOrderPaymentDB,private paymentService:IPaymentService){

    }
    initiatePayforOrder  = async (payment: OrderPayment): Promise<CreateOrderPaymentresponse> => {

        let savedPaymentOrder = await this.orderPaymentDB.getOne({id:payment.id}) ?? await this.orderPaymentDB.save(payment)
        
        let initiatedPayment = await this.paymentService.initiatePayment(savedPaymentOrder);
        return initiatedPayment

    }

    confirmPayment = async (transactionRef:string,totalAmount:number):Promise<confirmPaymentResponse> =>{

        let confirmPayment = await this.paymentService.confirmPayment(transactionRef);
        
        if (confirmPayment === null){throw new Error()}
        else if(confirmPayment.status !== "success"){ throw new BadRequestError(confirmPayment.message)}
        else if(totalAmount  !== confirmPayment.data?.amount){throw new BadRequestError("you paid: " +confirmPayment.data?.amount + " instead of :" + totalAmount)}
        else if(confirmPayment.data?.currency !=="NGN"){throw new BadRequestError("The currency you paid with isn't NGN")}
        else if(confirmPayment.data.status === "successful"){return confirmPayment.data} 
        else throw new Error("Payment not successful")
        

    }

   
}




  
