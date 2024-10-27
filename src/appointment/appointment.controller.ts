import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { CreateSlotDto } from './dto/create-slot.dto';
import { ParseIdPipe } from 'src/user/pipes/paraseIdPipe';

@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post('/:id')
  create(
    @Body() createAppointmentDto: CreateAppointmentDto,
    @Param('id', ParseIdPipe) id,
  ) {
    return this.appointmentService.create(createAppointmentDto, id);
  }

  @Post('/slot')
  createSlots(@Body() createSlotDto: CreateSlotDto) {
    return this.appointmentService.createSlot(createSlotDto);
  }

  @Get()
  findAll() {
    return this.appointmentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appointmentService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    return this.appointmentService.update(+id, updateAppointmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appointmentService.remove(+id);
  }
}
