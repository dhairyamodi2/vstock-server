import { Body, Controller, Get, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { CustomRequest } from 'src/types/types';
import { SubscribeToDto } from './subscriptions.dto';
import { SubscriptionsService } from './subscriptions.service';

@Controller('subscriptions')
export class SubscriptionsController {
    constructor(private subService : SubscriptionsService){

    }
    @UseGuards(AuthGuard('jwt'))
    @Get()
    async mySubscriptions(@Req() req : CustomRequest){
        return req.user.uid;
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('subscribe')
    async subscribeToService(@Req() req : CustomRequest, @Body() body : SubscribeToDto, @Res() res: Response){
        const result = await this.subService.subscribeTo(body, req.user);
        return res.status(result.statusCode).json(result);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get()
    async checkActive(@Req() req : CustomRequest, @Res() res : Response){
        
    }
}
