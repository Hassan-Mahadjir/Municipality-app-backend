import { Module } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from 'src/entities/appointment.entity';
import { Department } from 'src/entities/department.entity';
import { User } from 'src/entities/user.entity';
import { Profile } from 'src/entities/profile.entity';
import { Availability } from 'src/entities/availability.entity';
import { AvailabilityDay } from 'src/entities/availability-day.entity';
import { UserService } from 'src/user/user.service';
import { DepartmentService } from 'src/department/department.service';
import { ProfileService } from 'src/profile/profile.service';
import { AppointmentTranslation } from 'src/entities/appointmentTranslation.entity';
import { TranslationService } from 'src/translation/translation.service';
import { ProfileTranslation } from 'src/entities/profileTranslation.entity';
import { departmentTranslation } from 'src/entities/departmentTranslation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Appointment,
      Department,
      User,
      Profile,
      ProfileTranslation,
      Availability,
      AvailabilityDay,
      AppointmentTranslation,
      departmentTranslation,
    ]),
  ],
  controllers: [AppointmentController],
  providers: [
    AppointmentService,
    UserService,
    DepartmentService,
    ProfileService,
    TranslationService,
  ],
})
export class AppointmentModule {}
