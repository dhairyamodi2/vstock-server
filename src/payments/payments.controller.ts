import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { CustomRequest } from 'src/types/types';
import { PaymentsDto } from './payments.dto';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {

    constructor(private paymentService : PaymentsService){

    }
    @UseGuards(AuthGuard('jwt'))
    @Post('process')
    async processPayment(@Req() req : CustomRequest, @Body() body : PaymentsDto, @Res() res : Response) {
        const result = await this.paymentService.processPayment(body, req.user);
        return res.status(result.statusCode).json(result);
    }

    @Get('load/stripe')
    async loadStripe(@Req() req : CustomRequest, @Res() res : Response){
        return res.status(200).json({
            publishable_key : 'pk_test_51MwJarSBJ7cnqOzKP9B3vNBsOhP05DSmm45vBLC6MArC5cYRf8A8cP1pRCL2btSvV93v59H4eCaE1VrKFGNuAoXK00943XcRgM'
        })
    }
}
