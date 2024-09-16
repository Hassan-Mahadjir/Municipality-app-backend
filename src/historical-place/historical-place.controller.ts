import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { HistoricalPlaceService } from './historical-place.service';
import { HistoricalPlace } from '../entities/historical-place.entity';

@Controller('historical-place')
export class HistoricalPlaceController {
  constructor(private readonly historicalPlaceService: HistoricalPlaceService) {}

  @Get()
  findAll(): Promise<HistoricalPlace[]> {
    return this.historicalPlaceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<HistoricalPlace> {
    return this.historicalPlaceService.findOne(id);
  }

  @Post()
  create(@Body() historicalPlace: HistoricalPlace): Promise<HistoricalPlace> {
    return this.historicalPlaceService.create(historicalPlace);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.historicalPlaceService.remove(id);
  }
}
