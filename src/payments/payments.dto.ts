import { IsIn, IsNotEmpty } from "class-validator";
import { In } from "typeorm";

export class PaymentsDto{
    @IsNotEmpty()
    @IsIn(['BUSINESS', 'AGENCY'])
    s_name : 'BUSINESS' | 'AGENCY';
}