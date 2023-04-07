import Category from "./categories.entity";

export interface CategoryResponse{
    statusCode : 200 | 400 | 500;
    message: string;
    data: Array<Category>;
    success: true | false;
}