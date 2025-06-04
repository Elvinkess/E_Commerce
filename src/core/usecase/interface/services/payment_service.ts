import { CreateOrderPaymentresponse } from "../../../domain/dto/responses/order_payment_responses";
import { FlwConfirmPaymentRes } from "../../../domain/dto/responses/payment_service_responses/flw_confirm_payment_res";

import { OrderPayment } from "../../../domain/entity/order_payment";

export interface IPaymentService{
    initiatePayment (orderPayment:OrderPayment) :Promise<CreateOrderPaymentresponse>
    
    confirmPayment (transactionRef:string):Promise<FlwConfirmPaymentRes >
}