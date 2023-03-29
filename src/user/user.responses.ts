import User from "./user.entity";

export interface LoginResponse{
    statusCode : 200 | 422 | 500
    message: string;
    data: {user : User | null, token: string  | null}
}


export interface RegisterResponse{
    statusCode : 200 | 400 | 422 | 500
    message: string;
    data: {user : User | null, token : string | null}
}