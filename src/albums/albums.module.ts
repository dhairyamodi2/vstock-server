import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Stock from 'src/stock/stock.entity';
import User from 'src/user/user.entity';
import Album from './albums.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User, Stock, Album])]
})
export class AlbumsModule {}
