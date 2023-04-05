import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatedResponse } from 'src/types/types';
import User from 'src/user/user.entity';
import { Repository, TypeORMError } from 'typeorm';
import Category from './categories.entity';
import { CategoryDto } from './cateogries.dto';

@Injectable()
export class CategoriesService {

    constructor(@InjectRepository(Category) private categoryRepo : Repository<Category>
    ){

    }

    async createCategory(payload : CategoryDto, user : User) : Promise<CreatedResponse>{
        try {

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

    async allCategories(){
        try {
            const categories = await this.categoryRepo.find();
            console.log(categories);
            return categories;
        } catch (error) {
            console.log(error);
            return 'error';
        }
    }
}
