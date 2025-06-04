import { error } from "console";
import { IApi } from "../../usecase/interface/api/api_call";
import { CancelShippingResponse, catData, CreateShippingRequest, CreateShippingResponse, DsWebhookResponse, getDeliveryCategoryResponse, GetShippingratesRequest, IDeliveryService, PackageItem, StandardSBResponse, ValidateAddressRequest, ValidateAdressResponse, } from "../../usecase/interface/services/delivery_service";
import { myBaseUrlConfig, ShipBubbleConfig } from "../config/shipbubble_config";

export class DeliveryService implements IDeliveryService{
    constructor(private api:IApi,private shipBubble:ShipBubbleConfig,public myBaseUrl:myBaseUrlConfig){}
  
    validateAddress = async (validateAddressRequest:ValidateAddressRequest): Promise<ValidateAdressResponse> => {


        let payload = {
            name:validateAddressRequest.name,
            email:validateAddressRequest.email,
            phone:validateAddressRequest.phone,
            address:validateAddressRequest.address
        }
        let response = await this.api.post<ValidateAdressResponse>(
            {
                url: `${this.shipBubble.baseUrl}/shipping/address/validate`,
                header:{
                    Authorization:`Bearer ${this.shipBubble.secretKey}`,
                },
                body:payload
            }
           
        )
        
        if(response.data?.data !== undefined){
           let res:ValidateAdressResponse ={
            status:response.data?.status ,
            message:response.data?.message,
            data:response.data?.data
            
           } 
           return res
        }
        throw new Error(response.message)
    }

    getDeliveryCategory = async(category:string): Promise<catData  > =>{
            let response = await this.api.get<getDeliveryCategoryResponse>(
                {
                    url:`${this.shipBubble.baseUrl}/shipping/labels/categories`,
                    header:{
                    Authorization:`Bearer ${this.shipBubble.secretKey}`,
                }
                }
            )
            if (response.data?.data !== null) {
                let categories = response.data?.data;
                
                let cat  = categories?.find(item => item.category.includes(category)) 
                if(!cat){ throw new Error("Category not found") }
                return cat
            }else{
                throw new Error(response.message)
            }    
    }


    getShippingrates= async (getShippingrateRequest: GetShippingratesRequest): Promise<StandardSBResponse> => {
        
            let payload :GetShippingratesRequest = {
                sender_address_code: getShippingrateRequest.sender_address_code,
                reciever_address_code: getShippingrateRequest.reciever_address_code,
                pickup_date: getShippingrateRequest.pickup_date,
                category_id: getShippingrateRequest.category_id,
                package_items: getShippingrateRequest.package_items,
                package_dimension: {
                    length: getShippingrateRequest.package_dimension.length,
                    width: getShippingrateRequest.package_dimension.width,
                    height:getShippingrateRequest.package_dimension.height
                },
                delivery_instructions: getShippingrateRequest.delivery_instructions
            }

        let response = await this.api.post<StandardSBResponse>(
            {
                url: `${this.shipBubble.baseUrl}/shipping/fetch_rates`,
                header:{
                    Authorization:`Bearer ${this.shipBubble.secretKey}`,
                },
                body:payload
            }

        )
        if(response.ok){
            return response.data as StandardSBResponse
        }else{
         throw new Error(response.data?.message)
        }
    }

    createShipping =async(createShippingRequest: CreateShippingRequest): Promise<CreateShippingResponse> =>{

        let payload = {
            request_token:createShippingRequest.request_token,
            service_code: createShippingRequest.service_code,
            courier_id:createShippingRequest.courier_id
        }
        let response = await this.api.post<CreateShippingResponse>(
            {
                url:`${this.shipBubble.baseUrl}/shipping/labels`,
                header:{
                    Authorization:`Bearer ${this.shipBubble.secretKey}`,
                },
                body:payload
            }
        )
        if(response.ok){
            return response.data as CreateShippingResponse
        }else{
            throw new Error(response.data?.message)
        }
    }
    

    cancelShipping = async (shippingId:string):Promise<CancelShippingResponse> =>{
        let response = await this.api.post<CancelShippingResponse>(
            {
                url:`${this.shipBubble.baseUrl}/shipping/labels/cancel/${shippingId}`,
                header:{
                    Authorization:`Bearer ${this.shipBubble.secretKey}`,
                }
            }
        )
        if(response.ok){
             return response.data as  CancelShippingResponse
        }else{
            throw new Error(response.message)
        }
    }
    
}