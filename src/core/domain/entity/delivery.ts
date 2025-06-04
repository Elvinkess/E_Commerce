import { MyBaseEntity } from "./shared/my_base_entity"

export enum delivery_status{
    PENDING ="pending",
    IN_TRANSIT = "in_transit",
    DELIVERED = "delivered",
    RETURNED ="returned",
    ARRIVED_FOR_PICKUP="arrived for pickup",
    CANCELLED = "cancelled",
    REJECTED = "rejected",
    PAID="paid"



}
export class DeliveryData extends MyBaseEntity{
    constructor(public orderid:number,public userid:number,public addressid:number,public trackingurl:string,public status:delivery_status,public date:Date,public shippingid:string){
        super(0)
    }
}


