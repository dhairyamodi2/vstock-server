import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import {env} from './constants/constants';

import { AssetsModule } from './assets/assets.module';
import { OrdersModule } from './orders/orders.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import UserEntity from './user/user.entity';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    host: env.db_host,
    port: env.db_port,
    username: env.db_user,
    password: env.db_password,
    database: env.db_name,
    synchronize: true,
    entities: [UserEntity],
    logging: true
  }),UserModule, AssetsModule, OrdersModule, SubscriptionsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
