import { Request } from "express";
import User from "src/user/user.entity";

export interface CustomRequest extends Request{
    user : User 
}