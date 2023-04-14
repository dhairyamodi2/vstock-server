import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatedResponse, GetReqResponse } from 'src/types/types';
import User from 'src/user/user.entity';
import { Repository, TypeORMError } from 'typeorm';
import { SubscribeToDto } from './subscriptions.dto';
import Subscription from './subscriptions.entity';

@Injectable()
export class SubscriptionsService {
    constructor(
        @InjectRepository(Subscription) private subRepo : Repository<Subscription>
    ){
    }


    async mySubscription(user: User): Promise<GetReqResponse<Array<Subscription>>>{
        try {
            const subs = await this.subRepo.find({where: {user: user.uid}});
            return {statusCode: 200, success: true, message: "", data: subs}
        } catch (error) {
            return {statusCode: 500, success: false, message: error, data: null}
        }
    }
    async subscribeTo(payload : SubscribeToDto, user : User) : Promise<CreatedResponse>{
        try {
            console.log(payload);
            if(payload.s_name == 'AGENCY') payload.remaining_images = 25;
            else if(payload.s_name == 'BUSINESS')payload.remaining_images = 5;
            else payload.remaining_images = 0;
            payload.user = user.uid;
            payload.active = true;
            await this.subRepo.insert(payload);
            console.log(payload);
            return {statusCode: 200, message: "subscribed", success: true}
        } catch (error) {
            console.log(error);
            if(error instanceof TypeORMError){
                return {statusCode: 422, message: error.message, success: false}
            }
            return {statusCode: 500, message: "Internal server", success: false}
        }
    }
}
