import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { NotificationTranslation } from 'src/entities/notificationTranslation.entity';
import { Notification } from 'src/entities/notification.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Department } from 'src/entities/department.entity';
import { Profile } from 'src/entities/profile.entity';
import { ProfileTranslation } from 'src/entities/profileTranslation.entity';
import { Report } from 'src/entities/report.entity';
import { Request } from 'src/entities/request.entity';
import { Animal } from 'src/entities/animal.entity';
import { UserService } from 'src/user/user.service';
import { DepartmentService } from 'src/department/department.service';
import { ProfileService } from 'src/profile/profile.service';
import { TranslationService } from 'src/translation/translation.service';
import { Appointment } from 'src/entities/appointment.entity';
import { AppointmentService } from 'src/appointment/appointment.service';
import { RequestService } from 'src/request/request.service';
import { ReportService } from 'src/report/report.service';
import { departmentTranslation } from 'src/entities/departmentTranslation.entity';
import { ReportTranslation } from 'src/entities/reportTranslation.entity';
import { RequestTranslation } from 'src/entities/requestTranslation.entity';
import { AnimalTranslation } from 'src/entities/animalTranslation.entity';
import { AppointmentTranslation } from 'src/entities/appointmentTranslation.entity';
import { Availability } from 'src/entities/availability.entity';
import { AvailabilityDay } from 'src/entities/availability-day.entity';
import { AvailabilityDayTranslation } from 'src/entities/availability-dayTranslation.entity';
import { ImageService } from 'src/image/image.service';
import { Image } from 'src/entities/image.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Notification,
      NotificationTranslation,
      User,
      Department,
      departmentTranslation,
      Profile,
      ProfileTranslation,
      Report,
      ReportTranslation,
      Request,
      RequestTranslation,
      Animal,
      AnimalTranslation,
      Appointment,
      AppointmentTranslation,
      Availability,
      AvailabilityDay,
      AvailabilityDayTranslation,
      Image,
    ]),
  ],
  controllers: [NotificationController],
  providers: [
    NotificationService,
    UserService,
    DepartmentService,
    ProfileService,
    TranslationService,
  ],
})
export class NotificationModule {}
