import { IsEmail, IsNotEmpty, IsNotEmptyObject } from "class-validator";

export class LoginDto {
    @IsNotEmpty()
    id: string;

    @IsNotEmpty()
    @IsEmail()
    email: string
}