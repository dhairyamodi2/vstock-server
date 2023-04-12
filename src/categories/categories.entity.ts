import Stock from "src/stock/stock.entity";
import { Column, Entity, ManyToMany, ManyToOne, PrimaryColumn } from "typeorm";


@Entity()
class Category{
    @PrimaryColumn()
    category_name: string;

    @Column({default: 'approved'})
    category_verdict : string;


    @Column('longtext', {nullable: false})
    category_image: string;

    @ManyToMany(() => Stock, (stock) => stock.categories)
    stock : Stock[]
}

export default Category;