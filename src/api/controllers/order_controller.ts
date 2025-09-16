import { IOrderLogic } from "../../core/usecase/interface/logic/order_logic";
import {Request, Response,NextFunction} from "express"

export class OrderController{
    constructor(private order:IOrderLogic){}
    create = async(req : Request<{userId?:number}, {},{},{guestId?:string} >, res: Response, next: NextFunction)=>{

        try {
            const userId = req.params.userId ? Number(req.params.userId) : null;
            const guestId = req.query.guestId ? String(req.query.guestId) : null;

            if (!userId && !guestId) {
            return res.status(400).json({ error: "Either userId or guestId is required" });
            }
            let order = await this.order.get(userId,guestId);
            console.log(order)
            res.json(order)
            
        } catch (err) {
            res.status(500).json({ error: (err as Error).message });

            
        }
    }

    getorderHistory = async(req : Request<{userId:number}, {},{} >, res: Response, next: NextFunction)=>{

        try {
            let order = await this.order.getOrderHistory(req.params.userId);
            res.json(order)
            
        } catch (err) {
            res.status(500).json({ error: (err as Error).message });

        }
    }

    payment = async(req : Request<{orderId:string}, {},{email?:string} >, res: Response, next: NextFunction)=>{

        try {

            const orderId = Number(req.params.orderId);
            if (isNaN(orderId)) {return res.status(400).json({ error: "Invalid orderId" })}

            const email=req.body.email
            let payment = await this.order.payForOrder(orderId,email);
            console.log(payment)
            res.status(200).json(payment)
            
        } catch (err) {
            res.status(500).json({ error: (err as Error).message });
            
        }
    }

    removeOrder = async(req : Request<{orderId:string}, {},{},{userId?: string; guestId?: string } >, res: Response, next: NextFunction)=>{
        try {
            const orderId = Number(req.params.orderId);
            if (isNaN(orderId)) {
              return res.status(400).json({ error: "Invalid orderId" });
            }
        
            const userId = req.query.userId ? Number(req.query.userId) : null;
            const guestId = req.query.guestId ? String(req.query.guestId) : null;
        
            if (!userId && !guestId) {
              return res.status(400).json({ error: "Either userId or guestId is required" });
            }
            let removeOrder = await this.order.remove(orderId,userId,guestId);
            res.status(200).json(removeOrder)
            
        } catch (err) {
            res.status(500).json({ error: (err as Error).message });
            
        }
    }

    confirmPayment = async(req : Request<{}, {},{},{tx_ref:string} >, res: Response, next: NextFunction)=>{

            try {
                let confirmPayment = await this.order.processCompletedPaymentForOrder(req.query.tx_ref);
                console.log(confirmPayment)
                res.status(200).json(confirmPayment)
                
            } catch (err) {
                res.status(500).json({ error: (err as Error).message });
                
            }
         }

}