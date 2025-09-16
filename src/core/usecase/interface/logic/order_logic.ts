import { CreateOrderPaymentresponse } from "../../../domain/dto/responses/order_payment_responses";
import { OrderHistoryResponse, OrderResponse } from "../../../domain/dto/responses/order_response";

export interface IOrderLogic{
    get(userId:number|null,guestId:string|null):Promise<OrderResponse>
    getOrderHistory  (userId: number): Promise<OrderHistoryResponse[]>
    remove (orderId: number, userId: number|null,guestId:string|null): Promise<string> 
    payForOrder (orderId:number,guestEmail?:string):Promise<CreateOrderPaymentresponse>
    processCompletedPaymentForOrder (transactionRef:string):Promise<any>
}
