import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { CartItem } from "../../../domain/entity/cart_item";


@Entity("cart_item")
export class  CartItemConfig extends BaseEntity implements CartItem{


    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    cart_id!: number

    @Column()
    product_id!: number

    @Column()
    purchased_price!: number

    @Column()
    quantity!: number
    
}
