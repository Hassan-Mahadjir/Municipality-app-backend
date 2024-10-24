import { Module } from '@nestjs/common';
import { BusService } from './bus.service';
import { BusController } from './bus.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Line } from 'src/entities/line.entity';
import { Station } from 'src/entities/station.entity';
import { Department } from 'src/entities/department.entity';
import { User } from 'src/entities/user.entity';
import { Profile } from 'src/entities/profile.entity';
import { DepartmentService } from 'src/department/department.service';
import { UserService } from 'src/user/user.service';
import { ProfileService } from 'src/profile/profile.service';
import { Day } from 'src/entities/day.entity';
import { TimeTable } from 'src/entities/time-table.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Line,
      Station,
      Department,
      User,
      Profile,
      Day,
      TimeTable,
    ]),
  ],
  controllers: [BusController],
  providers: [BusService, DepartmentService, UserService, ProfileService],
})
export class BusModule {}
