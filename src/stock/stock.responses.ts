import Category from "src/categories/categories.entity";
import Stock from "./stock.entity";

export interface StockCreateResponse{
    statusCode : 201 | 400 | 500 | 422 | 200
    message: string;
    success: true | false
}


export interface AllStockResponse<T> {
    statusCode : 200 | 400 | 500
    message: string;
    success: true | false;
    data: Array<T> | []
}

