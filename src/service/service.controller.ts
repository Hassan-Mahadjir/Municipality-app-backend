import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ParseIdPipe } from 'src/user/pipes/paraseIdPipe';

@Controller('service')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post(':id')
  create(
    @Body() createServiceDto: CreateServiceDto,
    @Param('id', ParseIdPipe) id,
  ) {
    return this.serviceService.create(id, createServiceDto);
  }

  @Get('all/:id')
  findDepartmentServices(@Param('id', ParseIdPipe) id) {
    return this.serviceService.findDepartmentServices(id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIdPipe) id) {
    return this.serviceService.findOneService(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIdPipe) id,
    @Body() updateServiceDto: UpdateServiceDto,
  ) {
    return this.serviceService.update(id, updateServiceDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIdPipe) id) {
    return this.serviceService.delete(id);
  }
}
