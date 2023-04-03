import Stock from "src/stock/stock.entity";
import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";

@Entity()
class User{
    @PrimaryColumn()
    id: string

    @Column({unique: true, nullable: false})
    email: string;

    @Column({nullable: false})
    name : string;

    @Column({nullable: true})
    industry: string;

    @Column({nullable : false})
    type: string 

    @Column({nullable: true})
    bank_ac_number: string

    @Column({nullable: true})
    IFS_code : string;

    @OneToMany(() => Stock, (stock) => stock.user)
    stock : Stock[]
}

export default User;