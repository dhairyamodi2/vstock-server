import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Stock from 'src/stock/stock.entity';
import User from 'src/user/user.entity';
import Category from './categories.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Stock, Category])]
})
export class CategoriesModule {}
