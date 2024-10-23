import { Controller, Get, Post, Param, Body, BadRequestException } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  // Check if a specific day is full
  @Get('is-day-full/:date')
  async isDayFull(@Param('date') date: string) {
    const isFull = await this.appointmentService.isDayFull(date);
    return { isFull };
  }

  // Check if a specific time slot is reserved
  @Get('is-time-reserved/:date/:time')
  async isTimeReserved(@Param('date') date: string, @Param('time') time: string) {
    const isReserved = await this.appointmentService.isTimeReserved(date, time);
    return { isReserved };
  }

  // Create a new appointment
  @Post('/appointment/:id')
  async createAppointment(@Body() createAppointmentDto: CreateAppointmentDto, @Param('userId') userId: string) {
    const { appointmentDate, appointmentTime } = createAppointmentDto;
    

    if (await this.appointmentService.isTimeReserved(appointmentDate, appointmentTime)) {
      throw new BadRequestException('This time slot is already reserved.');
    }

    return await this.appointmentService.createAppointment(createAppointmentDto, +userId);
  }
}