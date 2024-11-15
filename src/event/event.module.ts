import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Department } from 'src/entities/department.entity';
import { Profile } from 'src/entities/profile.entity';
import { Event } from 'src/entities/event.entity';
import { DepartmentService } from 'src/department/department.service';
import { UserService } from 'src/user/user.service';
import { ProfileService } from 'src/profile/profile.service';
import { Image } from 'src/entities/image.entity';
import { ImageService } from 'src/image/image.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Image, User, Department, Profile, Event]),
  ],
  controllers: [EventController],
  providers: [
    EventService,
    DepartmentService,
    UserService,
    ProfileService,
    ImageService,
  ],
})
export class EventModule {}