import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm"
import { Order } from "../../../domain/entity/order"
import { OrderStatus } from "../../../domain/enums/order_items"


@Entity("orders")
 export class OrderConfig extends BaseEntity  implements Order {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    user_id!:number

    @Column()
    total_price!:number

    @Column({ type: "enum", enum: OrderStatus, default: OrderStatus.PENDING })
    status!: OrderStatus   
    
    @Column()
    created_at!:number
  
}
