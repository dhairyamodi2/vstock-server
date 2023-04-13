import { IsInt, IsNotEmpty, IsOptional } from "class-validator";

export class SubscribeToDto{
    @IsNotEmpty()
    s_name : string;

    @IsOptional()
    user: string;

    @IsNotEmpty()
    @IsInt()
    amount_paid: number;

    //optional fields will be overrided anyway
    @IsOptional()
    remaining_images: number;

    @IsOptional() 
    active: boolean

}