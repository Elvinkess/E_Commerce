import { error } from "console";
import { CreateOrderPaymentresponse } from "../../domain/dto/responses/order_payment_responses";
import { OrderPayment } from "../../domain/entity/order_payment";
import {   IApi } from "../../usecase/interface/api/api_call";
import { IPaymentService } from "../../usecase/interface/services/payment_service";
import { FlwConfig } from "../config/flw_config";
import { FlwPaymentResponse } from "../../domain/dto/responses/payment_service_responses/flw_payment_res";
import { contentType } from "../../domain/enums/content_type";
import { FlwConfirmPaymentRes } from "../../domain/dto/responses/payment_service_responses/flw_confirm_payment_res";




 

export class FlwPaymentService implements IPaymentService{
    constructor(private api:IApi,private flwconfig:FlwConfig){}
    initiatePayment = async(orderPayment:OrderPayment) :Promise<CreateOrderPaymentresponse>=>{
        let flwPaymentReq = {
            tx_ref:orderPayment.transactionReference,
            amount:(orderPayment.amount + orderPayment.deliveryamount).toString(),
            currency:"NGN",
            payment_options: 'card, ussd, banktransfer, mobilemoneyghana',
            redirect_url:this.flwconfig.redirectUrl,
            customer:{
                email:orderPayment.userEmail,
                name:orderPayment.userEmail
            },
            customization:{
                title:"Our Payment platform"
            }

        }
       let _response = await this.api.post<FlwPaymentResponse>(
            {
                url: `${this.flwconfig.baseUrl}/payments`,
                header:{
                    Authorization:`Bearer ${this.flwconfig.secretKey}`,
                    contentType: contentType.applicationJson,
                
                },
                body:flwPaymentReq
            }
        )
         
         if(_response.ok){
            let payment = orderPayment as CreateOrderPaymentresponse
            let response = _response.data
           payment.redirectUrl = response?.data?.link ?? ""
           return payment
        }
         
          throw new Error(_response.message)
           
    }

    confirmPayment = async(transactionRef:string):Promise<FlwConfirmPaymentRes >=>{
        let options ={
            url: `${this.flwconfig.baseUrl}/transactions/verify_by_reference?tx_ref=${transactionRef}`,
            header:{
                Authorization:`Bearer ${this.flwconfig.secretKey}`,
                contentType: contentType.applicationJson,
                 accept: 'application/json'
            
            }
        }
        let _response = await this.api.get<FlwConfirmPaymentRes>(options)
        if(_response.ok){
            let response = _response.data
            return response as FlwConfirmPaymentRes            

        }else{
            let response = _response.data
            throw new Error(response?.message ?? _response.message)
        }
       
    }


}