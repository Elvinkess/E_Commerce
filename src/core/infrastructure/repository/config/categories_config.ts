import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Categories } from "../../../domain/entity/categories"
import { Product } from "../../../domain/entity/product"

@Entity("mycategories")
export class CategoriesConfig extends BaseEntity  implements Categories {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    name!: string

    @Column()
    description!: string

    
//   @OneToMany(() => Product, (product) => product.category_id)

    products: Product[] = []

}