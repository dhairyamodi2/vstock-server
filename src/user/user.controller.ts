import { Body, Controller, Get, Head, Header, Headers, Post, Req, Res, Request as NestRequest ,UnauthorizedException, UseGuards, Put } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import { endWith } from 'rxjs';
import { CustomRequest } from 'src/types/types';
import { Repository } from 'typeorm';
import { LoginDto, RegisterDto, UpdateDto } from './user.dto';
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
    async me(@Req() req: CustomRequest, @Res() res : Response) {
        console.log(req.user);
        if(!req.user){
            return res.status(401).json({success: false, message: "unauthorized", data: {user : null}})
        }
        return res.status(200).json({success: true, message: "", data: {user: req.user}});
    }

    @UseGuards(AuthGuard('jwt'))
    @Put('profile')
    async updateProfile(@Req() req: CustomRequest, @Res() res : Response, @Body() body: UpdateDto){
        const result = await this.userService.updateProfile(body, req.user);
        return res.status(result.statusCode).json(result);
    }

}

