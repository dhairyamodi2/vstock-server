import { BadGatewayException, BadRequestException, Get, Injectable, InternalServerErrorException, Put } from '@nestjs/common';
import cloudinary from 'src/storage/cloudinary.config';
import User from 'src/user/user.entity';
import { Readable } from 'stream';
import { SetCatDto, StockDto } from './stock.dto';
import { bucket } from 'src/storage/firebase.config';
import { CloudinaryUploadResponse, DeletedResponse } from 'src/types/types';
import path from 'path';
import { InjectRepository } from '@nestjs/typeorm';
import Stock from './stock.entity';
import { Any, FindOperator, In, Like, Repository, TypeORMError } from 'typeorm';
import { AllStockResponse, StockCreateResponse } from './stock.responses';
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
            // payload.verdict = user.user_type == 'admin' ? 'approved' : 'pending'
    
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
            if(!stock || stock.verdict != 'approved') return {statusCode: 200, message: "Given stock doesn't exits or it is not approved", success: false}
            const category = await this.categoryRepo.findOneBy({category_name: payload.category.category_name});

            if(!category || category.category_verdict != 'approved') return {statusCode: 200, message: "Given category doesn't exits or it hasn't been approved", success: false}

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
                return category.category_name !== payload.category.category_name
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

    async deleteStock(params: any, user: User) : Promise<DeletedResponse>{
        try {
            await this.stockRepo.delete({id: params.id});
            return {statusCode: 200, message: "Stock Deleted", success: true}
        } catch (error) {
            if(error instanceof TypeORMError){
                return {statusCode: 200, message: error.message, success: false}
            }
            return {statusCode: 500, message: "Internal server error", success: false}
        }
    }

    async getImagesByCategory(queries : any, user : User | null) : Promise<AllStockResponse<Array<Category>>>{
        try {
            console.log(queries);
            const category = queries.categories;
            console.log(category);
            if(!category) throw new SyntaxError();
            const result = await this.categoryRepo.find({
                where: [{
                    category_name: In(category)
                }, {
                    category_name: typeof category == 'string' ? category : ""
                }], 
                relations: {
                    stock: true
                }
            })
            return {statusCode: 200, message: "", data: result, success: true}
        } catch (error) {
            console.log(error);
            if(error instanceof TypeORMError){
                return {statusCode: 200, message: error.message, success: false, data: []}
            }
            if(error instanceof SyntaxError){
                return {statusCode: 400, message: 'category params required as array ?category=[]', success: false, data: []}
            }
            return {statusCode: 500, message: "Internal server error", success: false, data: []}
        }
    }


    async search(query: any, user : User) : Promise<AllStockResponse<Array<Stock>>>{
        try {
            let field = query.search_field as string;
            if(!field || field == "") {
                const result = await this.stockRepo.find();
                return {statusCode: 200, message: "", success: true, data: result};
            }
            let fields = field.split(' ');
            if(fields.length == 0){
                const result = await this.stockRepo.find();
                return;
            }
            let results : Array<Stock> = [];
            let startStringMatching = await this.stockRepo.find({
                where: {
                    image_name: Like(`${fields[0]}%`)
                }
            })
            console.log(startStringMatching);
            results = results.concat(startStringMatching);

            let categoryMatching = await this.categoryRepo.find({
                where:[ {
                    category_name: Like(`${fields[0]}%`)
                }, {category_name: field.length > 1 ? Like(`${fields[1]}%`) : ""}],
                relations: {
                    stock: true
                }
            })
            console.log(categoryMatching);
            categoryMatching.map((category) => {
                results = results.concat(category.stock);
            })
            results = results.concat(startStringMatching);

            let matching = await this.stockRepo.find({
                where: {
                    image_name: Like(`%${fields[0]}%`)
                }
            });
            results = results.concat(matching);
            return {statusCode: 200, message: "", data: results, success: true}
        } catch (error) {
            console.log(error);
            if(error instanceof TypeORMError){
                return {statusCode: 200, message: error.message, success: false, data: []}
            }
            return {statusCode: 500, message: "Internal server error", success: false, data: []}
        }
    }


    async getImageById(id : string) : Promise<AllStockResponse<Stock>>{
        try {
            const results = await this.stockRepo.findOne({
                where: {
                    id : id,
                    verdict: "approved"
                },
                relations: {
                    album: true,
                    categories: true,
                    user: true
                }
            })
            return {statusCode: 200, message: "", data: results, success: true}
        } catch (error) {
            console.log(error);
            if(error instanceof TypeORMError){
                return {statusCode: 200, message: error.message, success: false, data: []}
            }
            return {statusCode: 500, message: "Internal server error", success: false, data: []}
        }
    }

    async getStockByAlbum(name : string) : Promise<AllStockResponse<Array<Stock>>>{
        try {
            const results = await this.stockRepo.find({
                where: {
                    album: In([name]),
                    verdict: 'approved'
                },
                
            })
            return {statusCode: 200, message: "", success: true, data: results}
        } catch (error) {
            console.log(error);
            if(error instanceof TypeORMError){
                return {statusCode: 200, message: error.message, success: false, data: []}
            }
            return {statusCode: 500, message: "Internal server error", success: false, data: []}
        }
    }


    async getStockByUser(user : string){
        try {
            const results = await this.stockRepo.find({
                where: {
                    user: In([user]),
                    verdict: 'approved'
                },
            })
            return {statusCode: 200, message: "", success: true, data: results}
        } catch (error) {
            console.log(error);
            if(error instanceof TypeORMError){
                return {statusCode: 200, message: error.message, success: false, data: []}
            }
            return {statusCode: 500, message: "Internal server error", success: false, data: []}
        }
    }
}
