import { IsInt, IsNotEmpty } from "class-validator";

export class SubscribeToDto{
    @IsNotEmpty()
    s_name : string;

    @IsNotEmpty()
    user: string;

    @IsNotEmpty()
    @IsInt()
    amount_page: number;

}