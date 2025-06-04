import { BaseFlwResponse } from "./base_flw_response"

export interface FlwPaymentResponse extends BaseFlwResponse{ 
    data: {
        link:string
    } | null
}