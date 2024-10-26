import { Module } from '@nestjs/common';
import { DisasterPointService } from './disaster-point.service';
import { DisasterPointController } from './disaster-point.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DisasterPoint } from 'src/entities/disaster-point.entity';
import { Department } from 'src/entities/department.entity';
import { User } from 'src/entities/user.entity';
import { Profile } from 'src/entities/profile.entity';
import { DepartmentService } from 'src/department/department.service';
import { UserService } from 'src/user/user.service';
import { ProfileService } from 'src/profile/profile.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([DisasterPoint, Department, User, Profile]),
  ],
  controllers: [DisasterPointController],
  providers: [
    DisasterPointService,
    DepartmentService,
    UserService,
    ProfileService,
  ],
})
export class DisasterPointModule {}
