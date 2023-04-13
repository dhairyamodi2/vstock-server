import Stock from "src/stock/stock.entity";
import Subscription  from "src/subscriptions/subscriptions.entity";
import User from "src/user/user.entity";
import { Column, Entity, ManyToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
class Download{
    @PrimaryGeneratedColumn('uuid')
    d_id : string;

    @Column()
    stockId : string;

    @Column()
    contributor: string;

    @Column()
    customer : string;

    @Column()
    subscription: number;
}


export default Download;