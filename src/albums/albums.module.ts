import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Stock from 'src/stock/stock.entity';
import User from 'src/user/user.entity';
import { AlbumController } from './albums.controller';
import Album from './albums.entity';
import { AlbumService } from './albums.service';

@Module({
    imports: [TypeOrmModule.forFeature([User, Stock, Album])],
    controllers: [AlbumController],
    providers: [AlbumService],

})
export class AlbumsModule {}
