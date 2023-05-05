import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import {env} from 'process';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { StockModule } from './stock/stock.module';
import { CategoriesModule } from './categories/categories.module';
import { AlbumsModule } from './albums/albums.module';
import { AlbumController } from './albums/albums.controller';
import { AlbumService } from './albums/albums.service';
import { DownloadsModule } from './downloads/downloads.module';
import { PaymentsModule } from './payments/payments.module';
import UserEntity from './user/user.entity';
import StockEntity from './stock/stock.entity';
import AlbumEntity from './albums/albums.entity';
import CategoryEntity from './categories/categories.entity';
import SubscriptionEntity from './subscriptions/subscriptions.entity';
import DownloadEntity from './downloads/downloads.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    host: process.env.db_host,
    port: 3306,
    username: process.env.db_user,
    password: process.env.db_password,
    database: process.env.db_name ? process.env.db_name : "VStock",
    synchronize: true,
    entities: [UserEntity, StockEntity, AlbumEntity, CategoryEntity, SubscriptionEntity, DownloadEntity],
    logging: true
  }),UserModule, SubscriptionsModule, StockModule, CategoriesModule, AlbumsModule, DownloadsModule, PaymentsModule, ConfigModule.forRoot({
    isGlobal: true
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
