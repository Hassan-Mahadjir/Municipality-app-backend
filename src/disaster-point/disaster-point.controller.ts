import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DisasterPointService } from './disaster-point.service';
import { CreateDisasterPointDto } from './dto/create-disaster-point.dto';
import { UpdateDisasterPointDto } from './dto/update-disaster-point.dto';

@Controller('disaster-point')
export class DisasterPointController {
  constructor(private readonly disasterPointService: DisasterPointService) {}

  @Post()
  create(@Body() createDisasterPointDto: CreateDisasterPointDto) {
    return this.disasterPointService.create(createDisasterPointDto);
  }

  @Get()
  findAll() {
    return this.disasterPointService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.disasterPointService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDisasterPointDto: UpdateDisasterPointDto) {
    return this.disasterPointService.update(+id, updateDisasterPointDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.disasterPointService.remove(+id);
  }
}
