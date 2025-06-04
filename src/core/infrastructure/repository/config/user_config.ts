import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from "typeorm"
import { User, UserRole } from "../../../domain/entity/user"
``  
@Entity("myusers")
export class UserConfig extends BaseEntity  implements User {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    email!: string

    @Column()
    username!: string

    @Column()
    password!: string

    @Column({
      type: "enum",
      enum: UserRole,
      default: UserRole.USER, // Default role is "user"
    })
    role!: UserRole;

}

export { UserRole }
