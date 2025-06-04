import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Cart } from "../../../domain/entity/cart";
import { cart_status } from "../../../domain/enums/cart_status_enum";



@Entity("cart")
export class  CartConfig extends BaseEntity implements Cart{


    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    user_id!: number

    @Column("int",{array:true})
    cart_item_ids!: number[]

 

    @Column({
        type: "enum",
        enum: cart_status,
        default: cart_status.PENDING, // Default role is "user"
      })
      user_status!: cart_status;

    
}


    