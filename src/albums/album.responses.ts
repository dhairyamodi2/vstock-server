import Album from "./albums.entity";

export interface CreateAlbumResponse{
    statusCode : 201 | 400 | 500 | 422
    success: true | false
    message: string;
}

type Albums = {
    albums : Array<Album> | []
}
export interface AllAlbumsResponse{
    statusCode : 200 | 400 | 401 | 403 | 500;
    success: true | false;
    message: string;
    data: Albums

}