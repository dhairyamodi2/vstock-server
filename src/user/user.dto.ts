import { Contains, IsEmail, IsIn, IsNotEmpty, IsNotEmptyObject, IsOptional, ValidateIf } from "class-validator";

export class LoginDto {
    @IsNotEmpty()
    id: string;

    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsNotEmpty()
    type: string;
}

export class RegisterDto {
    private static roles : Array<string> = ['customer', 'contributor', 'admin', 'subadmin']
    @IsNotEmpty()
    id : string;

    @IsNotEmpty()
    email : string;

    @IsNotEmpty()
    @IsIn(RegisterDto.roles)
    type : string;

    @IsNotEmpty()
    name : string;

    @IsOptional()
    industry: string;

    @IsOptional()
    bank_ac_number : string;

    @IsOptional()
    IFS_code : string;
}