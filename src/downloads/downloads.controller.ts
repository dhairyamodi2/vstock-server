import { Body, Controller, Get, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { CustomRequest } from 'src/types/types';
import { DownloadsDto } from './downloads.dto';
import { DownloadsService } from './downloads.service';

@Controller('downloads')
export class DownloadsController {
    constructor(private downloadService : DownloadsService){

    }
    @UseGuards(AuthGuard('jwt'))
    @Get('invoked')
    async myInvokes(@Req() req : CustomRequest, @Param() params, @Res() res : Response){
        const result = await this.downloadService.myInvokes(req.user);
        return res.status(result.statusCode).json(result);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get(':stockId')
    async checkDownloads(@Req() req : CustomRequest, @Param() params, @Res() res : Response){
        const result = await this.downloadService.checkDownloads(params.stockId, req.user);
        return res.status(result.statusCode).json(result);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post()
    async addEntry(@Req() req : CustomRequest, @Body() body : DownloadsDto, @Res() res : Response){
        const result = await this.downloadService.addEntry(body, req.user);
        return res.status(result.statusCode).json(result);
    }


}
