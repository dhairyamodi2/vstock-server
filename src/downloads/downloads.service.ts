import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Subscription from 'src/subscriptions/subscriptions.entity';
import User from 'src/user/user.entity';
import { Repository, TypeORMError } from 'typeorm';
import Download from './downloads.entity';
import { CheckDownloadsResponse } from './downloads.responses';

@Injectable()
export class DownloadsService {
    constructor(
        @InjectRepository(Download) private downloadRepo : Repository<Download>,
        @InjectRepository(Subscription) private subRepo : Repository<Subscription>
    ){
        
    }

    async checkDownloads(stockId : string, user : User) : Promise<CheckDownloadsResponse>{
        try {
            const downloads = await this.downloadRepo.find({
                where: {
                    customer: user.uid,
                    stockId: stockId
                }
            })

            if(downloads.length > 0){
              return {statusCode: 200, success: true, message: "Selected video is already downloaded, You can check your account section's Downloads List, to download again", alreadyDownload: true, alreadySubscribed: false, subscription: null}
            } 
            const subscription = await this.subRepo.findOne({
                where: {
                    user: user.uid,
                    active: true
                }
            })

            if(subscription != null){
                return {
                    statusCode: 200, success: true, message: "You already have an active subscription", alreadyDownload: false, alreadySubscribed: true, subscription: subscription 
                };
            }
            return {
                statusCode: 200, success: true, message: "No active subscription", alreadyDownload: false, alreadySubscribed: true, subscription: null}
        } catch (error) {
            console.log(error)
            if(error instanceof TypeORMError){
                return {
                    statusCode: 200,
                    message: error.message,
                    alreadyDownload: false,
                    alreadySubscribed: false,
                    subscription: null,
                    success: false
                }
            }
            return {
                statusCode: 500,
                message: error,
                alreadyDownload: false,
                alreadySubscribed: false,
                subscription: null,
                success: false}
        }
    }
}
