import {  Request,Response,NextFunction } from "express"
import { AddressRequest, IAddressLogic } from "../../core/usecase/interface/logic/address_logic"
import { Address } from "../../core/domain/entity/address"


    
    export class  AddressController{
        constructor(private address:IAddressLogic){}
        createAddress =  async(req : Request<{}, {}, AddressRequest>, res: Response, next: NextFunction)=>{
        try {
            console.log(req.body)

            let address = await this.address.saveAddress(req.body);
            res.json(address);
            
            
        } catch (err) {
            res.json({error: (err as Error).message})
        }
    }

    
}