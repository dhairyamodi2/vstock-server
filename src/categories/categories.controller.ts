import { Body, Controller, FileTypeValidator, Get, ParseFilePipe, Post, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { CustomRequest } from 'src/types/types';
import { CategoriesService } from './categories.service';
import { CategoryDto } from './cateogries.dto';
import { Response } from 'express';

@Controller('categories')
export class CategoriesController {


    constructor(private categoryService : CategoriesService){

    }


    @UseGuards(AuthGuard('contributor'))
    @Post('create')
    @UseInterceptors(FileInterceptor('file'))
    async create(@UploadedFile(
        new ParseFilePipe({
            validators: [new FileTypeValidator({fileType: 'image'})]
        })
    ) file: Express.Multer.File, @Req() req: CustomRequest, @Body() body: CategoryDto, @Res() res: Response){
        const result = await this.categoryService.createCategory(body, req.user, file);
        return res.status(result.statusCode).json(result);
    }

    @Get('all')
    async all(@Req() req: CustomRequest, @Res() res: Response){
        const result = await this.categoryService.allCategories();
        return res.status(result.statusCode).json(result);
    }
}
