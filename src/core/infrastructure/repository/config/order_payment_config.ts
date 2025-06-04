import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm"
import { OrderPayment } from "../../../domain/entity/order_payment"
import { paymentStatus } from "../../../domain/enums/payment_status_enums"




@Entity("order_payment")
export class OrderPaymentConfig extends BaseEntity  implements OrderPayment {
   
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    amount!: number

    @Column()
    status!: paymentStatus

    @Column({name:"orderid"})
    orderId!: number

    @Column({name:"useremail"})
    userEmail!: string

    @Column()
    date!:Date

    @Column({name:"processorreference"})
    processorReference!: string

    @Column({name:"transactionreference"})
    transactionReference!: string

    @Column()
    remarks!:string
    @Column()
    deliveryamount!: number

}