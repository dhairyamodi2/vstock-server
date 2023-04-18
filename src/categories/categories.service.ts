import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import path from 'path';
import { bucket } from 'src/storage/firebase.config';
import { CreatedResponse } from 'src/types/types';
import User from 'src/user/user.entity';
import { Repository, TypeORMError } from 'typeorm';
import Category from './categories.entity';
import { CategoryResponse } from './categories.response';
import { CategoryDto } from './cateogries.dto';

@Injectable()
export class CategoriesService {

    constructor(@InjectRepository(Category) private categoryRepo : Repository<Category>
    ){

    }

    async createCategory(payload : CategoryDto, user : User, file: Express.Multer.File) : Promise<CreatedResponse>{
        try {
            const blob = bucket.file(Date.now() + path.extname(file.originalname));
            const blobStream = blob.createWriteStream();

            blobStream.on('error', (err) => {
                console.log()
            })
            blobStream.on('finish', () => {
                console.log('finished');
            })
            blobStream.end(file.buffer);
            const url = await blob.getSignedUrl({ action: 'read', expires: "03-08-2040" });

            payload.category_image = url[0];
            payload.category_verdict = user.user_type === 'admin' ? 'approved' : 'pending'
            await this.categoryRepo.insert(payload);
            return {statusCode: 201, message: "Category created" , success: true}
        } catch (error) {
            console.log(error);
            if(error instanceof TypeORMError){
                return {statusCode: 422, message: error.message, success: false}
            }
            return {statusCode: 500, message: '', success: false}
        }
    }

    async allCategories() : Promise<CategoryResponse>{
        try {
            const categories = await this.categoryRepo.find({
                where: {
                    category_verdict: 'approved'
                }
            }) 
            return {statusCode: 200, message: "", data: categories, success: true}
        } catch (error) {
            console.log(error);
            if(error instanceof TypeORMError){
                return {statusCode: 400, message: error.message, success: false, data: []}
            }
            return {statusCode: 500, message: '', success: false, data:[]}
        }
    }
}
