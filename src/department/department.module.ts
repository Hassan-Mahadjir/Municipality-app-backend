import { Module } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { DepartmentController } from './department.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Department } from 'src/entities/department.entity';
import { UserService } from 'src/user/user.service';
import { ProfileService } from 'src/profile/profile.service';
import { Profile } from 'src/entities/profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Department, Profile])],
  controllers: [DepartmentController],
  providers: [DepartmentService, UserService, ProfileService],
})
export class DepartmentModule {}
