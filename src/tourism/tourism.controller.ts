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
  update(
    @Param('id') id: string,
    @Body() updateTourismDto: UpdateRestaurantDto,
  ) {
    return this.tourismService.updateRestaurant(+id, updateTourismDto);
  }

  @Delete('restaurant/:id')
  remove(@Param('id') id: string) {
    return this.tourismService.removeRestaurant(+id);
  }
}
