import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm"
import { OrderItem } from "../../../domain/entity/order_item"


@Entity("order_item")
 export class OrderItemConfig extends BaseEntity  implements OrderItem {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    order_id!:number

    @Column()
    product_id!:number

    @Column()
    product_name!:string

    @Column()
    quantity!: number

    @Column()
    price!:number   
    
    @Column()
    created_at!:string

    @Column()
    message!:string


  
}
