import { Controller, Get, Param, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { CustomRequest } from 'src/types/types';
import { DownloadsService } from './downloads.service';

@Controller('downloads')
export class DownloadsController {
    constructor(private downloadService : DownloadsService){

    }

    @UseGuards(AuthGuard('jwt'))
    @Get(':stockId')
    async checkDownloads(@Req() req : CustomRequest, @Param() params, @Res() res : Response){
        const result = await this.downloadService.checkDownloads(params.stockId, req.user);
        return res.status(result.statusCode).json(result);
    }
}
