import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BaseEntity, ManyToOne } from "typeorm"
import { Product } from "../../../domain/entity/product"


@Entity("product")
 export class ProductConfig extends BaseEntity  implements Product {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    name!:string

    @Column()
    price!:number

    @Column()
    category_id!: number
    
    @Column()
    inventory_id!:number


    @Column()
    image_url!:string
}
