import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CustomRequest } from 'src/types/types';
import { CategoriesService } from './categories.service';
import { CategoryDto } from './cateogries.dto';

@Controller('categories')
export class CategoriesController {


    constructor(private categoryService : CategoriesService){

    }


    @UseGuards(AuthGuard('jwt'))
    @Post('create')
    async create(@Req() req: CustomRequest, @Body() body: CategoryDto, @Res() res: Response){
        const result = await this.categoryService.createCategory(body, req.user);
        return {result}
    }

    @Get('all')
    async all(@Req() req: CustomRequest, @Res() res: Response){
        return this.categoryService.allCategories();
    }
}
