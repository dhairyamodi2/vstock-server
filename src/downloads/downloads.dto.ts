import { IsIn, IsInt, IsNotEmpty, IsOptional } from "class-validator";

export class DownloadsDto{
    @IsNotEmpty()
    stockId : string;

    @IsNotEmpty()
    contributor: string;

    @IsOptional()
    customer : string;

    @IsNotEmpty()
    @IsInt()
    subscription : number;
    
}