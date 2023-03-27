import { Column, Entity, PrimaryColumn } from "typeorm";

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

    @Column({nullable: false})
    bank_ac_number: string

    @Column({nullable: false})
    IFS_code : string;
}

export default User;