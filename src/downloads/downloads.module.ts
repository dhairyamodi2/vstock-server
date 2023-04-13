import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Subscription from 'src/subscriptions/subscriptions.entity';
import User from 'src/user/user.entity';
import { DownloadsController } from './downloads.controller';
import Download from './downloads.entity';
import { DownloadsService } from './downloads.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Download, Subscription])],
  controllers: [DownloadsController],
  providers: [DownloadsService]
})
export class DownloadsModule {}
