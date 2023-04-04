import Stock from "src/stock/stock.entity";
import { Column, Entity, ManyToMany, ManyToOne, PrimaryColumn } from "typeorm";


@Entity()
class Category{
    @PrimaryColumn()
    name: string;

    @Column({default: 'pending'})
    verdict : string;

    @ManyToMany(() => Stock, (stock) => stock.categories)
    stock : Stock[]
}

export default Category;