import { Module, ValidationPipe } from '@nestjs/common';
import { StaffController } from './staff.controller';
import { StaffService } from './staff.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Staff } from 'src/entities/staff.entity';
import { Profile } from 'src/entities/profile.entity';
import { APP_PIPE } from '@nestjs/core';

@Module({
  imports: [TypeOrmModule.forFeature([Staff, Profile])],
  controllers: [StaffController],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    },
    StaffService,
  ],
})
export class StaffModule {}
