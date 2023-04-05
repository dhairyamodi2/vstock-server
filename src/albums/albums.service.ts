import { Injectable, UnprocessableEntityException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import Stock from "src/stock/stock.entity";
import { DeletedResponse } from "src/types/types";
import User from "src/user/user.entity";
import { Repository, TypeORMError } from "typeorm";
import { AllAlbumsResponse, CreateAlbumResponse } from "./album.responses";
import Album from "./albums.entity";

@Injectable()
export class AlbumService{
    constructor(
        @InjectRepository(Album) private albumRepo : Repository<Album>,
        @InjectRepository(Stock) private stockRepo : Repository<Stock>
    ){

    }
    async createAlbum(album_name : string, user : User) : Promise<CreateAlbumResponse>{
        try {
            await this.albumRepo.insert({
                album_name: album_name, user
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

    async getAlbumsOfUser(user : User) : Promise<AllAlbumsResponse>{
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
            return {statusCode: 200, success:true, message: "", data: albums}

        } catch (error) {
            if(error instanceof TypeORMError){
                return {statusCode: 200, message: error.message, success: false, data: []}
            }
            return {statusCode: 500, message: "Internal server error", success: false, data: []}
        }
    }

    async deleteAlbum(params: any, user: User) : Promise<DeletedResponse> {
        try {
            await this.stockRepo.delete({album: params.id, user: user});
            await this.albumRepo.delete({album_name: params.id, user: user});
            return {statusCode: 200, message: "Album and all of its images deleted", success: true};
        } catch (error) {
            if(error instanceof TypeORMError){
                return {statusCode: 200, message: error.message, success: false}
            }
            return {statusCode: 500, message: "Internal server error", success: false}
        }
    }

    async getStockByAlbum(name : string) : Promise<AllAlbumsResponse> {
        try {
            const results = await this.albumRepo.find({
                where: {
                    album_name: name
                },
                relations: {
                    stock: true
                }
            })
            return {statusCode: 200, message: "", success: true, data: results}
        } catch (error) {
            if(error instanceof TypeORMError){
                return {statusCode: 200, message: error.message, success: false, data: []}
            }
            return {statusCode: 500, message: "Internal server error", success: false, data: []}
        }
    }
}