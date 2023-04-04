import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockController } from './stock.controller';
import { StockService } from './stock.service';
import Album from 'src/albums/albums.entity';
import Category from 'src/categories/categories.entity';
import User from 'src/user/user.entity';
import Stock from './stock.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User, Stock, Album, Category])],
    controllers: [StockController],
    providers: [StockService, Stock]
})
export class StockModule {}
