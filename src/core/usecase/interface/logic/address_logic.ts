import { Address } from "../../../domain/entity/address"

export interface AddressRequest{
    name:string
    email:string
    phone:string
    address:string
    user_id:number
}

export interface IAddressLogic{
    saveAddress(address:AddressRequest):Promise<Address>
    getAddress(userId:number):Promise<Address>
    
}