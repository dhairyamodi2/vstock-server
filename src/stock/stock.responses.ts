export interface StockCreateResponse{
    statusCode : 201 | 400 | 500 | 422 | 200
    message: string;
    success: true | false
}