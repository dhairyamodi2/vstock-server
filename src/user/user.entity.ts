import Album from "src/albums/albums.entity";
import Stock from "src/stock/stock.entity";
import Subscription from "src/subscriptions/subscriptions.entity";
import { Column, Entity, ManyToMany, OneToMany, PrimaryColumn } from "typeorm";

@Entity()
class User{
    @PrimaryColumn()
    uid: string

    @Column({unique: true, nullable: false})
    email: string;

    @Column({nullable: false})
    name : string;

    @Column({nullable: true})
    industry: string;

    @Column({nullable : false})
    user_type: string 

    @Column({nullable: true})
    bank_ac_number: string

    @Column({nullable: true})
    IFS_code : string;

    @OneToMany(() => Stock, (stock) => stock.user)
    stock : Stock[]

    @OneToMany(() => Album, (album) => album.user, {cascade: true})
    albums : Album[]
}

export default User;