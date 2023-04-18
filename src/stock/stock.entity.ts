import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import User from "src/user/user.entity";
import Album from "src/albums/albums.entity";
import Category from "src/categories/categories.entity";


@Entity()
class Stock{
    @PrimaryGeneratedColumn('uuid')
    id : string;
    
    @Column({nullable: false})
    image_name : string;

    @Column({nullable: true})
    price : string;

    @Column({nullable: false, default: 'image'})
    type: string;

    @ManyToOne(() => User, (user) => user.stock)
    user : User

    @Column({default: 'approved'})
    verdict : string;

    @Column({nullable: true})
    reason_for_rejection : string;

    @Column('longtext', {nullable: false})
    public_url : string;

    @Column('longtext', {nullable: false})
    private_url : string;

    @ManyToOne(() => Album, (album) => album.stock)
    album : Album;

    @ManyToMany(() => Category, (category) => category.stock, {cascade: true})
    @JoinTable()
    categories : Category[]

    @CreateDateColumn()
    created_at : Date
}

export default Stock;