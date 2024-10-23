import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from '../entities/appointment.entity';
import { Department } from '../entities/department.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
  ) {}

  // Check if a specific day is fully booked
  async isDayFull(date: string): Promise<boolean> {
    const count = await this.appointmentRepository.count({
      where: { appointmentDate: date },
    });
    return count >= 8; // Adjust the limit as needed
  }

  // Check if a specific time slot is already reserved
  async isTimeReserved(date: string, time: string): Promise<boolean> {
    const appointment = await this.appointmentRepository.findOne({
      where: { appointmentDate: date, appointmentTime: time },
    });
    return !!appointment;
  }

  // Create a new appointment
  async createAppointment(createAppointmentDto: CreateAppointmentDto, userId:number): Promise<Appointment> {
    const user = await this.appointmentRepository.findOne({where:{id:userId}});

    if(!user) throw new NotFoundException(`user with #${userId} does not exist.`);

    const department = await this.departmentRepository.findOne({where:{name:createAppointmentDto.departmentName}})

    if(!department) throw new NotFoundException(`department with #${createAppointmentDto.departmentName} does not exist.`);

    const newAppointment = this.appointmentRepository.create({...createAppointmentDto,user:user});
    return await this.appointmentRepository.save(newAppointment);
  }
}