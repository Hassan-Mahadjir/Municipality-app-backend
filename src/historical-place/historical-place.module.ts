import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoricalPlace } from '../entities/historical-place.entity';
import { HistoricalPlaceService } from './historical-place.service';
import { HistoricalPlaceController } from './historical-place.controller';

@Module({
  imports: [TypeOrmModule.forFeature([HistoricalPlace])],
  providers: [HistoricalPlaceService],
  controllers: [HistoricalPlaceController],
})
export class HistoricalPlaceModule {}
