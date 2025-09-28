import { Request,Response,NextFunction } from "express";
import { IDeliveryLogic } from "../../core/usecase/interface/logic/delivery_logic";
import { DsWebhookResponse } from "../../core/usecase/interface/services/delivery_service";
import { HttpErrors } from "../../core/domain/entity/shared/error";


export class DeliveryController{
    constructor(private delivery:IDeliveryLogic){}
    webhooksocket = async(req : Request<{shippingId:string}, {},{} >, res: Response, next: NextFunction)=>{

        try {
            let body = req.body as DsWebhookResponse
            let webhook = await this.delivery.webhookDelivery(req.params.shippingId,body);
            res.status(200).json(webhook)
            
        } catch (err) {
            res.status(500).json({ error: (err as Error).message }); 
            
        }
    }

    cancelDelivery = async(req : Request<{shippingId:string}, {},{} >, res: Response, next: NextFunction)=>{

        try {
            let canceled = await this.delivery.cancelDelivery(req.params.shippingId);
            res.status(200).json(canceled)
            
        } catch (err) {
            if(err instanceof  HttpErrors){return res.status(err.statusCode).json({ error: err.message })}
            res.status(500).json({ error: (err as Error).message }); 
            
        }
    }
}