import { Contains, IsEmail, IsIn, IsNotEmpty, IsNotEmptyObject, IsOptional, ValidateIf } from "class-validator";

export class LoginDto {
    @IsNotEmpty()
    uid: string;

    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsNotEmpty()
    user_type: string;
}

export class RegisterDto {
    private static roles : Array<string> = ['customer', 'contributor', 'admin', 'subadmin']
    @IsNotEmpty()
    uid : string;

    @IsNotEmpty()
    email : string;

    @IsNotEmpty()
    @IsIn(RegisterDto.roles)
    user_type : string;

    @IsNotEmpty()
    name : string;

    @IsOptional()
    industry: string;

    @IsOptional()
    bank_ac_number : string;

    @IsOptional()
    IFS_code : string;
}