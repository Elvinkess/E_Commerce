import { OrderResponse } from "../../../domain/dto/responses/order_response"
import { Order } from "../../../domain/entity/order"
import { CancelShippingResponse, CreateShippingResponse, DsWebhookResponse, StandardSBResponse } from "../services/delivery_service"

export interface CreateDeliveryRequest{
    orderId:number
    pickUpDate:string
    deliveryInstructions:string
    orderDetails:OrderResponse
}
export interface  IDeliveryLogic{
    createDelivery(createDeliveryRequest:CreateDeliveryRequest):Promise<CreateShippingResponse>
    getDeliveryDate (order:Order):Promise<string> 
    cancelDelivery(shippingId:string):Promise<CancelShippingResponse>
    webhookDelivery(shippingId:string,body:DsWebhookResponse):Promise< DsWebhookResponse>
    getDeliveryFee (createDeliveryRequest:CreateDeliveryRequest): Promise<StandardSBResponse> 
}