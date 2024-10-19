import { Module } from '@nestjs/common';
import { CollectedVehicleService } from './collected-vehicle.service';
import { CollectedVehicleController } from './collected-vehicle.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectedVehicle } from 'src/entities/collected-vehicle.entity';
import { Department } from 'src/entities/department.entity';
import { DepartmentService } from 'src/department/department.service';
import { UserService } from 'src/user/user.service';
import { ProfileService } from 'src/profile/profile.service';
import { User } from 'src/entities/user.entity';
import { Profile } from 'src/entities/profile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CollectedVehicle, Department, User, Profile]),
  ],
  controllers: [CollectedVehicleController],
  providers: [
    CollectedVehicleService,
    DepartmentService,
    UserService,
    ProfileService,
  ],
})
export class CollectedVehicleModule {}
