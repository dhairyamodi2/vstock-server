import { IsNotEmpty, IsOptional } from "class-validator";

export class CategoryDto{
    @IsNotEmpty()
    category_name : string;

    @IsOptional()
    category_verdict : string;
}