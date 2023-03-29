import { Body, Controller, Get, Head, Header, Headers, Post, Req, Res, Request as NestRequest ,UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import { endWith } from 'rxjs';
import { Repository } from 'typeorm';
import { LoginDto, RegisterDto } from './user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private userService : UserService){
        
    }
    @Post('login')
    async login(@Body() body : LoginDto, @Res() res : Response){
        const payload = await this.userService.login(body);
        return res.status(payload.statusCode).json(payload);
    }

    @Post('register')
    async register(@Body() body: RegisterDto, @Res() res: Response){
        const payload = await this.userService.register(body);
        return res.status(payload.statusCode).json(payload);
    }

    @Get('me')
    @UseGuards(AuthGuard('jwt'))
    me(@Req() req) {
        return req.user;
    }

}

