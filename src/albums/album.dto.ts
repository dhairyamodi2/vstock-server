import { IsNotEmpty } from "class-validator";


export class AlbumCreateDto{
    @IsNotEmpty()
    album_name : string;
}