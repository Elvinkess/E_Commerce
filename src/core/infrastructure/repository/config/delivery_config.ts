import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { delivery_status, DeliveryData} from "../../../domain/entity/delivery";

@Entity("delivery")
export class DeliveryConfig extends BaseEntity implements DeliveryData {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  orderid!: number;

  @Column()
  userid!: number;

  @Column()
  addressid!: number;

  @Column()
  trackingurl!: string;


  @Column()
  status!: delivery_status;

  @Column()
  date!: Date;
  
  @Column()
  shippingid!:string
}