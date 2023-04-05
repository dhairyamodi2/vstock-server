import { IsArray, IsNotEmpty, IsNotEmptyObject, IsOptional } from "class-validator";
import Album from "src/albums/albums.entity";
import Category from "src/categories/categories.entity";
import User from "src/user/user.entity";

export class StockDto{
    @IsNotEmpty()
    image_name : string;

    @IsOptional()
    user : User

    @IsOptional()
    public_url : string;

    @IsOptional()
    private_url : string;

    @IsOptional()
    album : Album

    @IsOptional()
    @IsArray()
    categories: Array<Category>
}

export class SetCatDto{
    @IsNotEmpty()
    id : string;

    @IsNotEmpty()
    category: Category
}