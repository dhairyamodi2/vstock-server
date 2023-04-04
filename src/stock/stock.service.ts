import { Injectable, InternalServerErrorException, Put } from '@nestjs/common';
import cloudinary from 'src/storage/cloudinary.config';
import User from 'src/user/user.entity';
import { Readable } from 'stream';
import { SetCatDto, StockDto } from './stock.dto';
import { bucket } from 'src/storage/firebase.config';
import { CloudinaryUploadResponse } from 'src/types/types';
import path from 'path';
import { InjectRepository } from '@nestjs/typeorm';
import Stock from './stock.entity';
import { Repository, TypeORMError } from 'typeorm';
import { StockCreateResponse } from './stock.responses';
import Category from 'src/categories/categories.entity';

@Injectable()
export class StockService {
    constructor(
        @InjectRepository(Stock) private stockRepo : Repository<Stock>,
        @InjectRepository(Category) private categoryRepo : Repository<Category>
    ){

    }
    private async uploadFromBuffer(file: Express.Multer.File) {
        return new Promise<CloudinaryUploadResponse>((resolve, reject) => {
            const upload = cloudinary.uploader.upload_stream((err, result : CloudinaryUploadResponse) => {
                if (result) resolve(result);
                else reject(err);
            })
            let stream = new Readable();
            stream.push(file.buffer);
            stream.push(null);
            stream.pipe(upload);
        })
    }

    async uploadImage(file: Express.Multer.File, payload : StockDto, user : User) : Promise<StockCreateResponse> {
        try {
            payload.user = user;
            if(payload.album != undefined){
                payload.album = JSON.parse(payload.album as any);
            }

            //uploading low quality version
            const result = await this.uploadFromBuffer(file);

            //upload high quality image in bucket
            const blob = bucket.file(result.asset_id + path.extname(file.originalname));
            const blobStream = blob.createWriteStream();

            blobStream.on('error', (err) => {
                console.log()
            })
            blobStream.on('finish', () => {
                console.log('finished');
            })
            blobStream.end(file.buffer);

            //get signed url
            const url = await blob.getSignedUrl({ action: 'read', expires: "03-08-2040" })

            payload.public_url = result.url
            payload.private_url = url[0];
    
            await this.stockRepo.insert(payload);

            return {statusCode: 201, message: "Uploaded", success: true }
        } catch (error) {
            if(error instanceof TypeORMError){
                return {statusCode: 422, message: error.message, success: false}
            }
            return {statusCode: 500, message: '', success: false}
        }
    }

    async setCategories(payload: SetCatDto) : Promise<StockCreateResponse>{
        try {
            console.log(payload);
            const stock = await this.stockRepo.findOne({
                where: {
                    id : payload.id
                },
                relations: {
                    categories: true
                }
            })
            if(!stock) return {statusCode: 200, message: "Given stock doesn't exits", success: false}
            const category = await this.categoryRepo.findOneBy({name: payload.category.name});

            if(!category || category.verdict != 'approved') return {statusCode: 200, message: "Given category doesn't exits or it hasn't been approved", success: false}

            stock.categories.push(payload.category);
            await this.stockRepo.save(stock);
            return {statusCode: 201, message: "Category added", success: true}

        } catch (error) {
            if(error instanceof TypeORMError){
                return {statusCode: 422, message: error.message, success: false}
            }
            return {statusCode: 500, message: '', success: false}
        }        
    }
    async removeCategory(payload : SetCatDto) : Promise<StockCreateResponse>{
        try {
            const stock = await this.stockRepo.findOne({
                where: {
                    id: payload.id,
                },
                relations: {
                    categories: true
                }
            });
            if(!stock) return {statusCode: 200, message: "Given stock doesn't exits", success: false}

            stock.categories = stock.categories.filter((category) => {
                return category.name !== payload.category.name
            })
            await this.stockRepo.save(stock);
            return {statusCode: 201, message: "Category removed from selected post", success: true}

        } catch (error) {
            if(error instanceof TypeORMError){
                return {statusCode: 422, message: error.message, success: false}
            }
            return {statusCode: 500, message: '', success: false}
        }
    }
}
