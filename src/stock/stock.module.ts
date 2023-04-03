import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Album from 'src/albums/albums.entity';
import Category from 'src/categories/categories.entity';
import User from 'src/user/user.entity';
import Stock from './stock.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User, Stock, Album, Category])]
})
export class StockModule {}
