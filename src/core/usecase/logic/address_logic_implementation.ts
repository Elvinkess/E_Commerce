import { Address } from "../../domain/entity/address";
import { UserDb } from "../../infrastructure/repository/data_access/user_db";
import { IAddressDB } from "../interface/data_access/address_db";
import { IUserDb } from "../interface/data_access/user_db";
import { AddressRequest, IAddressLogic } from "../interface/logic/address_logic";
import { IDeliveryService, ValidateAddressRequest } from "../interface/services/delivery_service";
import { BadRequestError } from "../utilities/Errors/bad_request";

export class AddressLogic implements IAddressLogic{
    constructor(private addressDB:IAddressDB,private deliveryService:IDeliveryService,private userDB:IUserDb){}
    getAddress = async (userId: number): Promise<Address> => {
         let address= await this.addressDB.getOne({user_id:userId});
        if(!address){
            throw new BadRequestError("Add a Valid Address")
        }
        return address
        
    }

    saveAddress = async (address: AddressRequest): Promise<Address> =>{
        let validateReq: ValidateAddressRequest= {
            name:address.name,
            email:address.email,
            phone:address.phone,
            address:address.address,
        }

        const user = address.user_id ? await this.userDB.getOne({ id: address.user_id }) : null;

        if (!user && !address.guest_id) {
          throw new BadRequestError("Address must be associated with either a valid user or a guest");
        }

        let validateAddress = await this.deliveryService.validateAddress(validateReq)
        
        if(!validateAddress.data.address_code ){
            throw new BadRequestError("Please use a valid address")

           
        }else{
            let saveAddress= new Address(address.name,address.email,address.phone,validateAddress.data.address_code,address.user_id,address.guest_id,address.address)
            
            return await this.addressDB.save(saveAddress)
        }
    }

}