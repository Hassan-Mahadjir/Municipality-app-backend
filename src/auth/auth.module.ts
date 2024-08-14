import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { StaffService } from 'src/staff/staff.service';
import { LocalStrategy } from './strategies/local.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Staff } from 'src/entities/staff.entity';
import { UserService } from 'src/user/user.service';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Staff, User])],
  controllers: [AuthController],
  providers: [AuthService, StaffService, UserService, LocalStrategy],
})
export class AuthModule {}
