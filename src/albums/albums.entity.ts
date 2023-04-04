import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import User from "src/user/user.entity";
import Stock from "src/stock/stock.entity";

@Entity()
class Album{
    @PrimaryColumn()
    name : string;

    @OneToMany(() => Stock, (stock) => stock.album)
    stock: Stock[]

    @ManyToOne(() => User, (user) => user.albums)
    user : User
}

export default Album;
