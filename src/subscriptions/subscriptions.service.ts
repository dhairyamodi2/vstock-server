import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
    async subscribeTo(payload : SubscribeToDto, user : User){
        try {
            console.log(payload);
            if(payload.s_name == 'AGENCY') payload.remaining_images = 25;
            else if(payload.s_name == 'BUSINESS')payload.remaining_images = 5;
            else return "not suitable type";
            const subDetails = await this.subRepo.find({
                where: {
                    active : true,
                    user: user.uid
                }
            })
            
            if(subDetails.length > 0){
                return "you already have an active subscription";
            }
            payload.user = user.uid;
            payload.active = true;
            await this.subRepo.insert(payload);
            console.log(payload);
            return "subscribed";
        } catch (error) {
            console.log(error);
            if(error instanceof TypeORMError){
                return error.message
            }
            return 'error'
        }
    }
}
