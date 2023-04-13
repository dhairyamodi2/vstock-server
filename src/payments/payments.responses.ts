export interface PaymentResponse {
    success: boolean;
    statusCode : 200 | 400 | 500
    message : string;
    data: {client_secret : string} | null
}