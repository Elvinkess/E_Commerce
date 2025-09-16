import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Cart } from "../../../domain/entity/cart";
import { cart_status } from "../../../domain/enums/cart_status_enum";



@Entity("cart")
export class  CartConfig extends BaseEntity implements Cart{


    @PrimaryGeneratedColumn()
    id!: number

    @Column({ type: "int", nullable: true })
    user_id!: number | null

    @Column({ type: "varchar", length: 255, nullable: true })
    guest_id!: string | null

    @Column("int",{array:true})
    cart_item_ids!: number[]

    @Column({
        type: "enum",
        enum: cart_status,
        default: cart_status.PENDING, // Default role is "user"
      })
      user_status!: cart_status;

    
}


    