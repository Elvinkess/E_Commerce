import { IOrderLogic } from "../../core/usecase/interface/logic/order_logic";
import {Request, Response,NextFunction} from "express"

export class OrderController{
    constructor(private order:IOrderLogic){}
    create = async(req : Request<{userId:number}, {},{} >, res: Response, next: NextFunction)=>{

        try {
            let order = await this.order.get(req.params.userId);
            console.log(order)
            res.json(order)
            
        } catch (err) {
            res.json({error: (err as Error).message})
            
        }
    }

    payment = async(req : Request<{orderId:number}, {},{} >, res: Response, next: NextFunction)=>{

        try {
            let payment = await this.order.payForOrder(req.params.orderId);
            console.log(payment)
            res.status(200).json(payment)
            
        } catch (err) {
            res.json({error: (err as Error).message})
            
        }
    }

    removeOrder = async(req : Request<{orderId:number,userId:number}, {},{} >, res: Response, next: NextFunction)=>{
        try {
            let removeOrder = await this.order.remove(req.params.orderId,req.params.userId);
            res.status(200).json(removeOrder)
            
        } catch (err) {
            res.json({error: (err as Error).message})
            
        }
    }

    confirmPayment = async(req : Request<{}, {},{},{tx_ref:string} >, res: Response, next: NextFunction)=>{

            try {
                let confirmPayment = await this.order.processCompletedPaymentForOrder(req.query.tx_ref);
                console.log(confirmPayment)
                res.status(200).json(confirmPayment)
                
            } catch (err) {
                res.json({error: (err as Error).message})
                
            }
         }

}