import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { HistoricalPlace } from '../entities/historical-place.entity';
import { Restaurant } from '../entities/restaurant.entity';
import { Comment } from '../entities/comment.entity';
import { Image } from '../entities/image.entity';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { TourismService } from './tourism.service'

@Controller('tourism')
export class TourismController {
  constructor(private readonly tourismService: TourismService) {}

  @Post('/historical-place')
  createHistoricalPlace(@Body() historicalPlace: HistoricalPlace): Promise<HistoricalPlace> {
    return this.tourismService.createHistoricalPlace(historicalPlace);
  }

  @Get('/historical-place')
  findAllHistoricalPLaces(): Promise<HistoricalPlace[]> {
    return this.tourismService.findAllHistoricalPLaces();
  }

  @Get('/historical-place/:id')
  findOneHistoricalPLace(@Param('id') id: number): Promise<HistoricalPlace> {
    return this.tourismService.findOneHistoricalPLace(id);
  }

  @Delete('/historical-place/:id')
  removeHistoricalPLace(@Param('id') id: number): Promise<void> {
    return this.tourismService.removeHistoricalPLace(id);
  }

  @Get('/restaurant')
  findAllRestaurants(): Promise<Restaurant[]> {
    return this.tourismService.findAllRestaurants();
  }

  @Get('/restaurant/:id')
  findOneRestaurant(@Param('id') id: number): Promise<Restaurant> {
    return this.tourismService.findOneRestaurant(id); // Ensure proper conversion to bigint
  }

  @Post('restaurant')
  createRestaurant(@Param('id') id: number, @Body() createRestaurantDto: CreateRestaurantDto): Promise<Restaurant> {
    return this.tourismService.createRestaurant(createRestaurantDto);
  }

  @Patch('/restaurant/:id')
  updateRestaurant(@Param('id') id: number, @Body() updateRestaurantDto: Partial<CreateRestaurantDto>): Promise<Restaurant> {
    return this.tourismService.updateRestaurant(id, updateRestaurantDto);
  }

  @Delete('/restaurant/:id')
  deleteRestaurant(@Param('id') id: number): Promise<{ success: boolean }> {
    return this.tourismService.deleteRestaurant(id);
  }

  @Get('/comment')
  findAllComments(): Promise<Comment[]> {
    return this.tourismService.findAllComments();
  }

  @Get('/comment/:id')
  findOneComment(@Param('id') id: number): Promise<Comment> {
    return this.tourismService.findOneComment(id);
  }

  @Post('comment')
  createComment(@Body() comment: Comment): Promise<Comment> {
    return this.tourismService.createComment(comment);
  }

  @Delete('/comment/:id')
  removeComment(@Param('id') id: number): Promise<void> {
    return this.tourismService.removeComment(id);
  }

  @Get('/image')
  findAllImages(): Promise<Image[]> {
    return this.tourismService.findAllImages();
  }

  @Get('/image/:id')
  findOneImage(@Param('id') id: number): Promise<Image> {
    return this.tourismService.findOneImage(id);
  }

  @Post('image')
  createImage(@Body() image: Image): Promise<Image> {
    return this.tourismService.createImage(image);
  }

  @Delete('/image/:id')
  removeImage(@Param('id') id: number): Promise<void> {
    return this.tourismService.removeImage(id);
  }
}
