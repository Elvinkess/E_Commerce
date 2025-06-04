import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Address } from "../../../domain/entity/address";

@Entity("address")
export class  AddressConfig extends BaseEntity implements Address{


    @PrimaryGeneratedColumn()
    id!: number

    @Column()
   name!:string

    @Column()
    email!: string

    @Column()
    phone!:string

    @Column()
    address_code!:number

    @Column()
    user_id!: number

    @Column()
    address!:string


   

    
}