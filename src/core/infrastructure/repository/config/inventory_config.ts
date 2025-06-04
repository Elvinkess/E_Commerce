import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm"
import { inventory } from "../../../domain/entity/inventory"

@Entity("inventory")
 export class InventoryConfig extends BaseEntity  implements inventory {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    quantity_available!:number

    @Column()
    quantity_sold!:number

    @Column()
    product_id!: number
    

    
}