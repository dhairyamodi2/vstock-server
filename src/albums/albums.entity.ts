import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import User from "src/user/user.entity";
import Stock from "src/stock/stock.entity";

@Entity()
class Album{
    @PrimaryColumn('uuid')
    id: string;

    @Column({nullable: false})
    name : string;

    @OneToMany(() => Stock, (stock) => stock.album)
    stock: Stock[]
}

export default Album;
