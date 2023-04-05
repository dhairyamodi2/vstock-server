import { Body, Controller, Delete, FileTypeValidator, Get, Param, ParseFilePipe, Post, Put, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { query, Response } from 'express';
import { CustomRequest } from 'src/types/types';
import { SetCatDto, StockDto } from './stock.dto';
import { StockService } from './stock.service';


@Controller('stock')
export class StockController {

    constructor(private stockService : StockService){

    }


    @UseGuards(AuthGuard('jwt'))
    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async upload(@UploadedFile(
        new ParseFilePipe({
            validators: [new FileTypeValidator({fileType: 'image'})]
        })
    ) file: Express.Multer.File, @Body() body : StockDto, @Req() req : CustomRequest, 
    @Res() res : Response){
        if(!req.user) return res.status(401).json({success: false});
        const result = await this.stockService.uploadImage(file, body, req.user);
        return res.status(result.statusCode).json(result);
    }

    @Put('categories')
    async setCategory(@Req() req : Request, @Body() body : SetCatDto, @Res() res : Response){
        const response = await this.stockService.setCategories(body);
        return res.status(response.statusCode).json(response);
    }

    @Delete('categories')
    async removeCategory(@Req() req : Request, @Body() body : SetCatDto, @Res() res : Response){
        const response = await this.stockService.removeCategory(body);
        return res.status(response.statusCode).json(response);
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    async deleteStock(@Req() req : CustomRequest, @Param() params, @Res() res : Response){
        const result = await this.stockService.deleteStock(params, req.user);
        return res.status(result.statusCode).json(result);
    }

    @Get("filter")
    async getImages(@Req() req : CustomRequest, @Query() query, @Res() res : Response){
        const result = await this.stockService.getImagesByCategory(query, req.user);
        return res.status(result.statusCode).json(result);
    }

    @Get()
    async search(@Req() req : CustomRequest, @Query() query, @Res() res : Response){
        const result = await this.stockService.search(query, req.user);
        return res.status(result.statusCode).json(result);
    }

    @Get(":id")
    async getById(@Param() params, @Res() res : Response){
        const result = await this.stockService.getImageById(params.id)
        return res.status(result.statusCode).json(result);
    }

    
}
