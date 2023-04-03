import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from './user.entity';
import {JwtStrategy} from './user.strategy';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { env } from 'src/constants/constants';
import { PassportModule } from '@nestjs/passport';
import Stock from 'src/stock/stock.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Stock])],
  providers: [UserService, JwtStrategy],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule {
    
}
