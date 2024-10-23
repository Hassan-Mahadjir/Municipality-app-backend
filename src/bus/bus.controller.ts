import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BusService } from './bus.service';
import { CreateLineDto } from './dto/create-line.dto';
import { UpdateBusDto } from './dto/update-line.dto';
import { CreateStationDto } from './dto/create-station.dto';
import { ParseIdPipe } from 'src/user/pipes/paraseIdPipe';

@Controller('bus')
export class BusController {
  constructor(private readonly busService: BusService) {}

  @Post('add-line')
  create(@Body() createBusDto: CreateLineDto) {
    return this.busService.create(createBusDto);
  }

  @Get('lines')
  findAll() {
    return this.busService.findAll();
  }

  @Get('line/:id')
  findOne(@Param('id', ParseIdPipe) id) {
    return this.busService.findOneLine(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBusDto: UpdateBusDto) {
    return this.busService.update(+id, updateBusDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.busService.remove(+id);
  }

  @Post('add-station')
  createStation(@Body() createStationDto: CreateStationDto) {
    return this.busService.createStation(createStationDto);
  }

  @Get('stations')
  findAllStation() {
    return this.busService.findAllStation();
  }

  @Get('station/:id')
  findStation(@Param('id', ParseIdPipe) id) {
    return this.busService.findSation(id);
  }

  @Patch('update-station/:id')
  updateStation(
    @Param('id', ParseIdPipe) id,
    @Body() createStationDto: CreateStationDto,
  ) {
    return this.busService.updateStation(id, createStationDto);
  }

  @Delete('station/:id')
  deleteStation(@Param('id', ParseIdPipe) id) {
    return this.busService.deleteStation(id);
  }
}
