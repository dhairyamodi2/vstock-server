import { Body, Controller, Header, Post, Response as Res } from '@nestjs/common';
import { Response } from 'express';
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
}

