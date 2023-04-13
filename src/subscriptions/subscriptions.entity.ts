import User from "src/user/user.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
class Subscription{
    @PrimaryGeneratedColumn()
    s_id : number;


    @Column({nullable: false})
    s_name : string;

    @Column()
    remaining_images : number

    @Column({nullable: false})
    active : boolean

    @Column({nullable: false})
    user : string;

    @Column({nullable: false})
    amount_paid: number;

}


export default Subscription;