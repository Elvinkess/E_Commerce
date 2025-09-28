import {  Request,Response,NextFunction } from "express"
import { AddressRequest, IAddressLogic } from "../../core/usecase/interface/logic/address_logic"
import { Address } from "../../core/domain/entity/address"
import { HttpErrors } from "../../core/domain/entity/shared/error";


    
export class  AddressController{
        constructor(private address:IAddressLogic){}
        createAddress =  async(req : Request<{}, {}, AddressRequest>, res: Response, next: NextFunction)=>{
        try {

            let address = await this.address.saveAddress(req.body);
            res.json(address);
            
            
        } catch (err) {
            if(err instanceof HttpErrors){return res.status(err.statusCode).json({ error: err.message })}
            res.json({error: (err as Error).message})
        }
    }
    getAddress = async(req:Request<{},{},{},{userId:string}>,res:Response, next:NextFunction)=>{
         try {
            const{userId}=req.query
            const id = Number(userId)
            const address = await this.address.getAddress(id)
            res.status(200).json(address)
         } catch (err) {
            if(err instanceof HttpErrors){return res.status(err.statusCode).json({ error: err.message })}
            res.status(500).json({ error: (err as Error).message });
            
         }
    }

    
}