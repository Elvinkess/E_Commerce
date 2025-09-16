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

    @Column({ type: "int", nullable: true })
    user_id!: number | null

    @Column({ type: "varchar", length: 255, nullable: true })
    guest_id!: string | null

    @Column()
    address!:string


   

    
}