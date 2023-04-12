import { Body, Controller, Get, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
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
    @Post()
    async subscribeToService(@Req() req : CustomRequest, @Body() body : SubscribeToDto, @Res() res: Response){

    }

    @UseGuards(AuthGuard('jwt'))
    @Get()
    async checkActive(@Req() req : CustomRequest, @Res() res : Response){
        
    }
}
