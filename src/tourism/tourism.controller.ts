import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TourismService } from './tourism.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { ParseIdPipe } from 'src/user/pipes/paraseIdPipe';
import { CreateHistoricalPlaceDto } from './dto/create-historical-place';
import { UpdateHistoricalPlaceDto } from './dto/update-historical-place';

@Controller('tourism')
export class TourismController {
  constructor(private readonly tourismService: TourismService) {}

  @Post('restaurant')
  createRestaurant(@Body() createTourismDto: CreateRestaurantDto) {
    return this.tourismService.createRestaurant(createTourismDto);
  }

  @Get('restaurant')
  findAllRestaurant() {
    return this.tourismService.findAllRestaurant();
  }

  @Get('restaurant/:id')
  findOne(@Param('id') id: string) {
    return this.tourismService.findOneRestaurant(+id);
  }

  @Patch('restaurant/:id')
  updateRestaurant(
    @Param('id') id: string,
    @Body() updateRestaurantDto: UpdateRestaurantDto,
  ) {
    return this.tourismService.updateRestaurant(+id, updateRestaurantDto);
  }

  @Delete('restaurant/:id')
  remove(@Param('id') id: string) {
    return this.tourismService.removeRestaurant(+id);
  }

  @Post('historical-palce')
  createHistoricalPlace(
    @Body() createHistoricalPlaceDto: CreateHistoricalPlaceDto,
  ) {
    return this.tourismService.createHistoricalPlace(createHistoricalPlaceDto);
  }
  @Get('historical-palce/:id')
  findAllHistoricalPlace(@Param('id', ParseIdPipe) id) {
    return this.tourismService.findHistoricalPlace(id);
  }

  @Get('historical-palce')
  findHistoricalPlaces() {
    return this.tourismService.findAllHistoricalPlace();
  }

  @Patch('historical-palce/:id')
  updateHistoricalPlace(
    @Param('id', ParseIdPipe) id,
    @Body() updateHistoricalPlace: UpdateHistoricalPlaceDto,
  ) {
    return this.tourismService.updateHistoricalPlace(id, updateHistoricalPlace);
  }

  @Delete('historical-palce/:id')
  deleteHistoricalPlace(@Param('id', ParseIdPipe) id) {
    return this.tourismService.deleteHistoricalPlace(id);
  }
}
