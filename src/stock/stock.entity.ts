import { Column, Entity, ManyToMany, ManyToOne, PrimaryColumn } from "typeorm";
import User from "src/user/user.entity";
import Album from "src/albums/albums.entity";
import Category from "src/categories/categories.entity";


@Entity()
class Stock{
    @PrimaryColumn("uuid")
    id : string;
    
    @Column({nullable: false})
    name : string;

    @Column({nullable: true})
    price : string;

    @Column({nullable: false})
    type: string;

    @ManyToOne(() => User, (user) => user.stock)
    user : User

    @Column({default: 'pending'})
    verdict : string;

    @Column({nullable: true})
    reason_for_rejection : string;

    @Column({nullable: true})
    public_url : string;

    @Column({nullable: true})
    private_url : string;

    @ManyToOne(() => Album, (album) => album.stock)
    album : Album;

    @ManyToMany(() => Category, (category) => category.stock)
    categories : Category[]
}

export default Stock;