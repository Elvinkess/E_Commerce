import { Address } from "../../../domain/entity/address"

export interface AddressRequest{
    name:string
    email:string
    phone:string
    address:string
    user_id:number | null
    guest_id:string | null
}

export interface IAddressLogic{
    saveAddress(address:AddressRequest):Promise<Address>
    getAddress(userId:number):Promise<Address>
    
}