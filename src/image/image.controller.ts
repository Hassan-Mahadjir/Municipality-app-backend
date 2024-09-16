import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ImageService } from './image.service';
import { Image } from '../entities/image.entity';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Get()
  findAll(): Promise<Image[]> {
    return this.imageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Image> {
    return this.imageService.findOne(id);
  }

  @Post()
  create(@Body() image: Image): Promise<Image> {
    return this.imageService.create(image);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.imageService.remove(id);
  }
}
