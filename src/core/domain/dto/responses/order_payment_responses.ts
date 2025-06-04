import { OrderPayment } from "../../entity/order_payment";

export class CreateOrderPaymentresponse extends OrderPayment{
    redirectUrl!:string
}