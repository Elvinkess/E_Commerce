import { storeAddressCode } from "../../../api/program";
import { delivery_status, DeliveryData } from "../../domain/entity/delivery";
import { Order } from "../../domain/entity/order";
import { OrderItem } from "../../domain/entity/order_item";
import { OrderStatus } from "../../domain/enums/order_items";
import { IAddressDB } from "../interface/data_access/address_db";
import { IDeliveryDB } from "../interface/data_access/delivery_db";
import { IOrderDB } from "../interface/data_access/order_db";
import { IProductDB } from "../interface/data_access/product_db";
import { IUserDb } from "../interface/data_access/user_db";
import { CreateDeliveryRequest, IDeliveryLogic } from "../interface/logic/delivery_logic";
import { IOrderLogic } from "../interface/logic/order_logic";
import { CancelShippingResponse, CreateShippingRequest, CreateShippingResponse, DsWebhookResponse, GetShippingratesRequest, IDeliveryService, StandardSBResponse } from "../interface/services/delivery_service";

export interface PackageItem {
    name:string
    description:string
    unit_weight:number
    unit_amount:number
    quantity:number
}

 export interface PackageDimension{   
    length:number,
    width:number,
    height:number
}

export class DeliveryLogic implements IDeliveryLogic{
    constructor(private deliveryService:IDeliveryService,private userDB:IUserDb,private addressDB:IAddressDB,private deliveryDb:IDeliveryDB,private productDB:IProductDB){}
    
    
    createDelivery = async(createDeliveryRequest:CreateDeliveryRequest):Promise<CreateShippingResponse>=>{



        let order = createDeliveryRequest.orderDetails
        if(!order){throw new Error("ORDER not found!!");}
        if(order.status === OrderStatus.DELIVERED){throw new Error("Order has already been delivered")}

        let user = await this.userDB.getOne({id:order.user_id});
        if(!user){throw new Error("USER not found!!")}

        let address = await this.addressDB.getOne({user_id:user?.id});
        if(!address){ throw new Error("Please add  an  address")}

        let shippingRate = await this.getDeliveryFee(createDeliveryRequest)

       //  Variables needed to create a shipment most gotten from the shippingrate response
       let shippingRequest:CreateShippingRequest ={
           request_token: shippingRate.data.request_token,
           service_code: shippingRate.data.fastest_courier.service_code,
           courier_id: shippingRate.data.fastest_courier.courier_id
       }
       
       // Creating a shipment 
       let shipping = await this.deliveryService.createShipping(shippingRequest)
       let date = new Date()
       
       let deliveryData = new DeliveryData(order.id,user.id,address.address_code,shipping.data.tracking_url,delivery_status.PENDING,date,shipping.data.order_id)
       await this.deliveryDb.save(deliveryData)
       return shipping;  
    }

    getDeliveryDate = async(order:Order):Promise<string> =>{
       
        let date = new Date()
        let deliveryDate = date.getDate() + 7;

        let dat = new Date(date.setDate(deliveryDate));

         let pad = (n: number) => n.toString().padStart(2, '0');
 
         let year = date.getFullYear();
         let month = pad(date.getMonth() + 1); // getMonth() is 0-indexed
         let day = pad(date.getDate());
 
         let formattedDate = `${year}-${month}-${day}`;
        return formattedDate
        
         // Create a Date object
         // Helper to pad single-digit numbers with a leading zero
         // Extract and format components



    }

    cancelDelivery = async(shippingId: string): Promise<CancelShippingResponse> => {
  
        let shipping = await this.deliveryDb.getOne({shippingid:shippingId})
        if(!shipping){throw new Error(` There is no shpping with this ID: ${shippingId}`)}
        let cancelshipping = await this.deliveryService.cancelShipping(shipping.shippingid)
        await this.deliveryDb.update({id:shipping.id},{status:delivery_status.CANCELLED})
        return cancelshipping


    }

    webhookDelivery = async(shippingId: string,body:DsWebhookResponse): Promise<DsWebhookResponse> => {
       if(body.event === "shipment.status.changed"){
        await this.deliveryDb.update({shippingid:shippingId},{status:body.package_status[body.package_status.length -1].status});
       }
       if(body.event === "shipment.cancelled"){
        await this.deliveryDb.update({shippingid:shippingId},{status:body.package_status[body.package_status.length -1].status});
       }
       return body
        //get the event that wa  sent from the webhook response
        //if webhook rsponse shipment.status.changed 
        //get the new status and update the status in my db
    }

    getDeliveryFee = async(createDeliveryRequest:CreateDeliveryRequest): Promise<StandardSBResponse> =>{

        let order = createDeliveryRequest.orderDetails
        if(!order){throw new Error("ORDER not found!!");}
        if(order.status === OrderStatus.DELIVERED){throw new Error("Order has already been delivered")}

        let user = await this.userDB.getOne({id:order.user_id});
        if(!user){throw new Error("USER not found!!")}

        let address = await this.addressDB.getOne({user_id:user?.id});
        
        if(!address){ throw new Error("Please add  an  address")}
    
        let orderCat = order.Order_items[0].product?.category?.name
      

        //get  category id to identify the type of order for the delivery service
        let catId = await this.deliveryService.getDeliveryCategory( orderCat ?? "Light weight items")

        // a list of items to be delivered by the delivery service 
        let packageItems:PackageItem[] =[]
        

        for(let i = 0; i < order.Order_items.length; i++ ){
            let product = await this.productDB.getOne({id:order.Order_items[i].product_id})
            let item: PackageItem = {
                name: product?.name ?? "",
                description: "best product",
                unit_weight: 1,
                unit_amount: order.Order_items[i].price,
                quantity:order.Order_items[i].quantity
            }
            packageItems.push(item)
        }

        // the whole package item deimension
        let packageDimension:PackageDimension ={
            length:12,
            width:12,
            height:12
        }

        let rateReq: GetShippingratesRequest ={
            sender_address_code :storeAddressCode.senderAddress,
            reciever_address_code:address.address_code,
            pickup_date:createDeliveryRequest.pickUpDate,
            category_id: catId.category_id,
            package_items:packageItems,
            package_dimension:packageDimension,
            delivery_instructions:createDeliveryRequest.deliveryInstructions

        }
        let shippingRate = await this.deliveryService.getShippingrates(rateReq)
        return shippingRate
    }
    

}