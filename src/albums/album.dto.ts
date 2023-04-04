import { IsNotEmpty } from "class-validator";


export class AlbumCreateDto{
    @IsNotEmpty()
    name : string;
}