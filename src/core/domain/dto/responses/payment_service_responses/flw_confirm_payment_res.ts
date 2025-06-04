import { BaseFlwResponse } from "./base_flw_response";

export interface FlwConfirmPaymentRes extends BaseFlwResponse{
    data:    confirmPaymentResponse | null  
 }

 export interface confirmPaymentResponse{
             id: string,
            tx_ref: string,
            flw_ref: string,
            amount: number,
            currency: string,
            charged_amount: number,
            app_fee: number,
            merchant_fee: number,
            processor_response: string,
            auth_model: string,
            ip: string,
            narration: string,
            status: string,
            payment_type:string,
            created_at: string,
            account_id:number,
 }