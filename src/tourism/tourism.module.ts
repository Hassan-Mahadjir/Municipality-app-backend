import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoricalPlace } from '../entities/historical-place.entity';
import { Restaurant } from '../entities/restaurant.entity';
import { Image } from '../entities/image.entity';
import { Comment } from '../entities/comment.entity';
import { TourismService } from './tourism.service';
import { TourismController } from './tourism.controller';

@Module({
  imports: [TypeOrmModule.forFeature([HistoricalPlace, Restaurant, Image, Comment])],
  providers: [TourismService],
  controllers: [TourismController],
})
export class TourismModule {}
