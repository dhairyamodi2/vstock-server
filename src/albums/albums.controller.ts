import { Body, Controller, Delete, Get, Param, Post, Req, Res, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Response } from "express";
import { CustomRequest } from "src/types/types";
import { AlbumCreateDto } from "./album.dto";
import { AlbumService } from "./albums.service";

@Controller('albums')
export class AlbumController{

    constructor(private albumService : AlbumService){


    }
    @UseGuards(AuthGuard('contributor'))
    @Post('create')
    async createAlbum(@Req() req: CustomRequest, @Body() body : AlbumCreateDto, @Res() res: Response){
        const response = await this.albumService.createAlbum(body.album_name, req.user);
        return res.status(response.statusCode).json(response); 
    }

    @UseGuards(AuthGuard('contributor'))
    @Get('all')
    async getAlbums(@Req() req: CustomRequest){
        return this.albumService.getAlbumsOfUser(req.user);
    }

    @UseGuards(AuthGuard('contributor'))
    @Delete(':id')
    async deleteAlbum(@Param() params, @Req() req: CustomRequest, @Res() res : Response){
        const result = await this.albumService.deleteAlbum(params, req.user);
        return res.status(result.statusCode).json(result);
    }

    // @Get('stock/:name')
    // async getStockByAlbum(@Param() params, @Res() res : Response){
    //     const result = await this.albumService.getStockByAlbum(params.name);
    //     return res.status(result.statusCode).json(result);
    // }
}