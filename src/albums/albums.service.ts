import { Injectable, UnprocessableEntityException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import User from "src/user/user.entity";
import { Repository, TypeORMError } from "typeorm";
import { CreateAlbumResponse } from "./album.responses";
import Album from "./albums.entity";

@Injectable()
export class AlbumService{
    constructor(
        @InjectRepository(Album) private albumRepo : Repository<Album>
    ){

    }
    async createAlbum(name : string, user : User) : Promise<CreateAlbumResponse>{
        try {
            await this.albumRepo.insert({
                name, user
            })
            return {statusCode: 201, success: true, message: "Album created"}
        } catch (error) {
            console.log(error);

            if(error instanceof TypeORMError){
                return {statusCode: 422, success: false, message: error.message}
            }
            return {statusCode: 500, success: false, message: 'Internal server error'}
        }
    }

    async getAlbumsOfUser(user : User){
        try {
            const albums = await this.albumRepo.find({
                where: {
                    user: user,
                },
                relations: {
                    user: true,
                    stock: true
                }
            })
            return albums;

        } catch (error) {
            console.log(error);
            return 'error'
        }
    }
}