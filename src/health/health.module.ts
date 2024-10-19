import { Module } from '@nestjs/common';
import { HealthService } from './health.service';
import { HealthController } from './health.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pharmacy } from 'src/entities/pharmacy.entity';
import { Hospital } from 'src/entities/hospitals.entity';
import { DepartmentService } from 'src/department/department.service';
import { Department } from 'src/entities/department.entity';
import { User } from 'src/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { ProfileService } from 'src/profile/profile.service';
import { Profile } from 'src/entities/profile.entity';

@Module({
  controllers: [HealthController],
  providers: [HealthService, DepartmentService, UserService, ProfileService],
  imports: [
    TypeOrmModule.forFeature([Pharmacy, Hospital, Department, User, Profile]),
  ],
})
export class HealthModule {}
