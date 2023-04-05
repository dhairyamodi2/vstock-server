import { Request } from "express";
import User from "src/user/user.entity";

export interface CustomRequest extends Request{
    user : User 
}


export interface CloudinaryUploadResponse{
    asset_id? : string;
    url? : string;

}

export interface CreatedResponse{
    statusCode : 200 | 201 | 400 | 422 | 500;
    message: string;
    success: true | false;
}

export interface DeletedResponse{
    statusCode : 200 | 400 | 500
    message: string;
    success: true | false
}