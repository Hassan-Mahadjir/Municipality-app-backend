import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { Restaurant } from '../entities/restaurant.entity';
import { CreateRestaurantDto } from './dto/create-restaurant.dto'; // Ensure this import is correct

@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Get()
  findAll(): Promise<Restaurant[]> {
    return this.restaurantService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Restaurant> {
    return this.restaurantService.findOne(BigInt(id)); // Ensure proper conversion to bigint
  }

  @Post()
  create(@Body() createRestaurantDto: CreateRestaurantDto): Promise<Restaurant> {
    return this.restaurantService.create(createRestaurantDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateRestaurantDto: Partial<CreateRestaurantDto>): Promise<Restaurant> {
    return this.restaurantService.update(BigInt(id), updateRestaurantDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<{ success: boolean }> {
    return this.restaurantService.delete(BigInt(id));
  }
}
