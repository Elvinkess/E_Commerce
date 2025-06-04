export interface ValidateAdressResponse{
    status: string,
    message: string,
    data: {
        address_code: number,
        address: string
    }
}

export interface ValidateAddressRequest{
  name:string,
  email:string,
  phone:string,
  address:string

}

export interface catData{
  category_id:number,
  category:string
}

export interface Courier{
  courier_id:string
  service_code:string
  delivery_eta:string
  delivery_eta_time:string
  total:number
  
}
export interface ShippingData{
  request_token:string
  fastest_courier:Courier
}

export interface getDeliveryCategoryResponse {
  status:string,
  message:string,
  data?:catData[]
}

export interface StandardSBResponse{
  status:string,
  message:string,
  data:ShippingData
}
export interface PackageItem{
  name:string,
  description:string,
  unit_weight:number,
  unit_amount:number,
  quantity:number
   
}
export interface PackageDimension{
  length:number,
  width:number,
  height:number
}

export interface GetShippingratesRequest{
    sender_address_code: number,
    reciever_address_code:number,
    pickup_date:string,
    category_id:number,
    package_items:PackageItem[]
    package_dimension:PackageDimension
    delivery_instructions:string
}
export interface CreateShippingRequest{
    request_token: string,
    service_code:string,
    courier_id:string
}
export interface CancelShippingResponse{
  status:string,
  message:string
}


export interface CreateShippingResponse {
  status:string,
  message:string,
  data:{
    order_id: string,
    courier: {
        name: string,
        email: string,
        phone: string
    },
    status: string,
    payment: {
      shipping_fee: number,
      status: string,
      currency: string
    },
    tracking_url: string,
          date: string
  }
}

export interface DsWebhookResponse{
  date: string,
  order_id: string,
  status: string,
  connected_account: boolean,
  courier: {
    name: string,
    service_icon: string,
    email: string,
    phone: string,
    tracking_code:string ,
    tracking_message: string,
    rider_info: string
  },
  package_status: [
    {
      status: string,
      datetime: string
    },
  ],
  tracking_url: string,
  event: string

}


export interface IDeliveryService{
  validateAddress(validateAddressRequest:ValidateAddressRequest):Promise<ValidateAdressResponse>

  getDeliveryCategory(category:string):Promise<catData>

  getShippingrates(getShippingrateRequest:GetShippingratesRequest):Promise<StandardSBResponse>

  createShipping(createShippingRequest:CreateShippingRequest):Promise<CreateShippingResponse>

  cancelShipping(shippingId:string):Promise<CancelShippingResponse>

  //deliveryServiceWebhook(orderId:string):Promise<DsWebhookResponse>
}