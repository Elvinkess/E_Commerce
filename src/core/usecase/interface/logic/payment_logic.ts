import { CreateOrderPaymentresponse } from "../../../domain/dto/responses/order_payment_responses";
import { confirmPaymentResponse } from "../../../domain/dto/responses/payment_service_responses/flw_confirm_payment_res";
import { OrderPayment } from "../../../domain/entity/order_payment";

export interface IPaymentLogic{
    //processCompletedPaymentForOrder (transactionRef:string):Promise<any> 
    initiatePayforOrder  (payment: OrderPayment): Promise<CreateOrderPaymentresponse> 
    confirmPayment  (transactionRef:string,totalAmount:number):Promise<confirmPaymentResponse> 

} 
