import { CreateOrderPaymentresponse } from "../../../domain/dto/responses/order_payment_responses";
import { OrderResponse } from "../../../domain/dto/responses/order_response";

export interface IOrderLogic{
    get(userId:number):Promise<OrderResponse>
    payForOrder (orderId:number):Promise<CreateOrderPaymentresponse>
    processCompletedPaymentForOrder (transactionRef:string):Promise<any>
}