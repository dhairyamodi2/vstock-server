import User from "./user.entity";

export interface AuthResponse{
    statusCode : 200 | 422 | 500 | 400
    message: string;
    data: {user : User | null, token: string  | null}
}

