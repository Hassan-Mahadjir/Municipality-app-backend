import { Module, ValidationPipe } from '@nestjs/common';
import { ServiceService } from './service.service';
import { ServiceController } from './service.controller';
import { Service } from 'src/entities/service.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartmentService } from 'src/department/department.service';
import { APP_PIPE } from '@nestjs/core';
import { Department } from 'src/entities/department.entity';
import { UserService } from 'src/user/user.service';
import { User } from 'src/entities/user.entity';
import { Profile } from 'src/entities/profile.entity';
import { ProfileService } from 'src/profile/profile.service';

@Module({
  imports: [TypeOrmModule.forFeature([Service, Department, User, Profile])],
  controllers: [ServiceController],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        // whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    },
    ServiceService,
    ProfileService,
    DepartmentService,
    UserService,
  ],
})
export class ServiceModule {}
