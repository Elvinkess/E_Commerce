import { paymentStatus } from "../enums/payment_status_enums";
import { MyBaseEntity } from "./shared/my_base_entity";


export interface IOrderPaymentInit{
    amount:number,
    status:paymentStatus,
    orderId:number,
    userEmail:string,
    date:Date,
    processorReference?:string
    transactionReference?:string,
    remarks?:string,
    deliveryamount?:number
}

export class OrderPayment extends MyBaseEntity{
    amount:number
    status:paymentStatus
    orderId:number
    userEmail:string
    date:Date
    processorReference:string
    transactionReference:string
    remarks:string
    deliveryamount:number
    constructor(init: IOrderPaymentInit){
        super(0)
        this.amount=init.amount,
        this.status =init.status,
        this.orderId =init.orderId,
        this.userEmail = init.userEmail,
        this.date= init.date,
        this.processorReference = init.processorReference??"",
        this.transactionReference = init.transactionReference ?? "",
        this.remarks = init.remarks ?? "",
        this.deliveryamount = init.deliveryamount ?? 0

        
    }


}