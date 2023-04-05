import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import {env} from './constants/constants';
import { OrdersModule } from './orders/orders.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { StockModule } from './stock/stock.module';
import { CategoriesModule } from './categories/categories.module';
import { AlbumsModule } from './albums/albums.module';
import { AlbumController } from './albums/albums.controller';
import { AlbumService } from './albums/albums.service';
import UserEntity from './user/user.entity';
import StockEntity from './stock/stock.entity';
import AlbumEntity from './albums/albums.entity';
import CategoryEntity from './categories/categories.entity';
@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    host: env.db_host,
    port: env.db_port,
    username: env.db_user,
    password: env.db_password,
    database: env.db_name,
    synchronize: true,
    entities: [UserEntity, StockEntity, AlbumEntity, CategoryEntity],
    logging: true
  }),UserModule, OrdersModule, SubscriptionsModule, StockModule, CategoriesModule, AlbumsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
