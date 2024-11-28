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
import { Roles } from 'src/auth/decorators/role.decorator';
import { Role } from 'src/auth/enums/role.enums';
import { UpdateSlotDto } from './dto/update-slot.dto';

@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Roles(Role.ADMIN, Role.STAFF)
  @Post('/slot')
  createSlots(@Body() createSlotDto: CreateSlotDto) {
    return this.appointmentService.createSlot(createSlotDto);
  }

  @Get('/slot')
  getSlots() {
    return this.appointmentService.getSlots();
  }

  @Post('/:id')
  create(
    @Body() createAppointmentDto: CreateAppointmentDto,
    @Param('id', ParseIdPipe) id,
  ) {
    return this.appointmentService.create(createAppointmentDto, id);
  }

  @Get()
  findAll() {
    return this.appointmentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appointmentService.findOne(+id);
  }

  @Get('user/:id')
  findUserAppointments(@Param('id', ParseIdPipe) id) {
    return this.appointmentService.getUserAppointments(id);
  }

  @Roles(Role.ADMIN, Role.STAFF)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    return this.appointmentService.update(+id, updateAppointmentDto);
  }

  @Roles(Role.ADMIN, Role.STAFF)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appointmentService.remove(+id);
  }
}
