import { Body, Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Response } from "express";
import { CustomRequest } from "src/types/types";
import { AlbumCreateDto } from "./album.dto";
import { AlbumService } from "./albums.service";

@Controller('albums')
export class AlbumController{

    constructor(private albumService : AlbumService){


    }
    @UseGuards(AuthGuard('jwt'))
    @Post('create')
    async createAlbum(@Req() req: CustomRequest, @Body() body : AlbumCreateDto, @Res() res: Response){
        const response = await this.albumService.createAlbum(body.name, req.user);
        return res.status(response.statusCode).json(response); 
    }

    @Get('all')
    async getAlbums(@Req() req: CustomRequest){
        return this.albumService.getAlbumsOfUser(req.user);
    }
}