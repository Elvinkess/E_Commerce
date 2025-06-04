import { MyBaseEntity } from "./shared/my_base_entity"

export class Address extends MyBaseEntity{
constructor(public name:string,public email:string,public phone:string,public address_code:number,public user_id:number,public address:string){
    super(0)
}
}