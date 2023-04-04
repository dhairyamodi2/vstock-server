export interface CreateAlbumResponse{
    statusCode : 201 | 400 | 500 | 422
    success: true | false
    message: string;
}