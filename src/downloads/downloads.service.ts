import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Stock from 'src/stock/stock.entity';
import Subscription from 'src/subscriptions/subscriptions.entity';
import { CreatedResponse } from 'src/types/types';
import User from 'src/user/user.entity';
import { Repository, TypeORMError } from 'typeorm';
import { DownloadsDto } from './downloads.dto';
import Download from './downloads.entity';
import { CheckDownloadsResponse, InvokesData, MyInvokes } from './downloads.responses';

@Injectable()
export class DownloadsService {
    constructor(
        @InjectRepository(Download) private downloadRepo : Repository<Download>,
        @InjectRepository(Subscription) private subRepo : Repository<Subscription>,
        @InjectRepository(Stock) private stockRepo : Repository<Stock>
    )
    {}

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
                statusCode: 200, success: true, message: "No active subscription", alreadyDownload: false, alreadySubscribed: false, subscription: null}
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
    async addEntry(payload : DownloadsDto, user : User) : Promise<CreatedResponse>{
        try {
            payload.customer = user.uid;
            const sub = await this.subRepo.findOne({
                where: {
                    s_id: payload.subscription,
                    active: true,
                    user: user.uid
                }
            })
            if(!sub){
                return {statusCode: 422, message: "Subscription Doens't exists. There is some error, please contact our support team", success: false}
            }
            if(sub.remaining_images == 1) sub.active = false;
            sub.remaining_images = sub.remaining_images - 1;
            await this.subRepo.save(sub);
            await this.downloadRepo.insert(payload);
            return {statusCode: 200, message: "", success: true}
        } catch (error) {
            if(error instanceof TypeORMError){
                return {statusCode: 422, message: error.message, success: false}
            }
            return {statusCode: 500, message: "Internal Server Error", success: false}
        }
    }

    async myInvokes(user : User) : Promise<MyInvokes>{
        try {
            const downloads = await this.downloadRepo.findBy({
                customer: user.uid
            });
            let myInvokes : Array<InvokesData> = [];
            for(let i = 0; i<downloads.length; i++){
                const stock = await this.stockRepo.findOneBy({
                    id: downloads[i].stockId
                })
                if(stock){
                    myInvokes.push({id: stock.id, private_url: stock.private_url})
                }
            }
            return {statusCode: 200, message: "", success: true, data: myInvokes}
        } catch (error) {
            return {statusCode: 500, message: error, data: [], success: false}
        }
    }
}
