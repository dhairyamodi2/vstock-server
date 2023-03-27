import User from "./user.entity";

export interface LoginResponse{
    statusCode : 200 | 412 | 500
    message: string;
    data: {user : User | null, token: string  | null}
}