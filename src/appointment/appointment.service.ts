import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { CreateSlotDto } from './dto/create-slot.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Availability } from 'src/entities/availability.entity';
import { Repository } from 'typeorm';
import { AvailabilityDay } from 'src/entities/availability-day.entity';
import { DepartmentService } from 'src/department/department.service';
import { UserService } from 'src/user/user.service';
import { Appointment } from 'src/entities/appointment.entity';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Availability)
    private availabilityRepo: Repository<Availability>,
    @InjectRepository(Appointment)
    private appointmentRepo: Repository<Appointment>,
    @InjectRepository(AvailabilityDay)
    private dayRepo: Repository<AvailabilityDay>,
    private departmentService: DepartmentService,
    private userService: UserService,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto, userId: number) {
    const { date, startTime, purpose, appointmentWith } = createAppointmentDto;

    // Check if the user exists
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new NotFoundException(`User with ID #${userId} does not exist.`);
    }

    // Check if the user already has an appointment on the given date
    const existingAppointment = await this.appointmentRepo.findOne({
      where: {
        user: { id: userId },
        availability: { day: { date } },
      },
      relations: ['availability', 'availability.day'],
    });

    if (existingAppointment) {
      throw new ConflictException(
        'You already have an appointment booked on this date.',
      );
    }

    // Check if the availability exists for the given date and startTime and if it's unbooked
    const availableSlot = await this.availabilityRepo.findOne({
      where: { day: { date }, startTime, appointment: null },
      relations: ['day'],
    });

    if (!availableSlot) {
      throw new ConflictException(
        'The selected time slot is already booked or unavailable.',
      );
    }

    // Create a new appointment and associate it with the available slot
    const newAppointment = this.appointmentRepo.create({
      purpose,
      appointmentWith,
      user,
      availability: availableSlot,
    });

    // Save the new appointment in the database
    await this.appointmentRepo.save(newAppointment);

    return newAppointment;
  }

  async createSlot(createSlotDto: CreateSlotDto) {
    const { date, numberOfSlots, startingTimes, duration, departmentName } =
      createSlotDto;

    // Check if the department exists
    const department =
      await this.departmentService.findDepartmentbyName(departmentName);
    if (!department) {
      throw new NotFoundException(
        `Department with name ${departmentName} does not exist.`,
      );
    }

    // Find or create the AvailabilityDay for the given date
    let availabilityDay = await this.dayRepo.findOne({ where: { date } });
    if (!availabilityDay) {
      const dayOfWeek = new Date(date).toLocaleString('en-US', {
        weekday: 'long',
      });
      availabilityDay = this.dayRepo.create({ date, day: dayOfWeek });
      availabilityDay = await this.dayRepo.save(availabilityDay);
    }

    const slots = [];
    for (let i = 0; i < numberOfSlots; i++) {
      const startTime = startingTimes[i];
      if (!startTime) break;

      const [startHour, startMinutes] = startTime.split(':').map(Number);
      const endHour = startHour + Math.floor((startMinutes + duration) / 60);
      const endMinutes = (startMinutes + duration) % 60;
      const endTime = `${endHour.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
      const slot = this.availabilityRepo.create({
        startTime,
        endTime,
        day: availabilityDay,
        department,
      });
      slots.push(slot);
    }
    return await this.availabilityRepo.save(slots);
  }

  async findAll() {
    const appointments = await this.appointmentRepo.find({
      relations: ['availability', 'availability.day', 'user.profile'],
    });
    return appointments;
  }

  findOne(id: number) {
    return `This action returns a #${id} appointment`;
  }

  update(id: number, updateAppointmentDto: UpdateAppointmentDto) {
    return `This action updates a #${id} appointment`;
  }

  remove(id: number) {
    return `This action removes a #${id} appointment`;
  }
}
