import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ProfileModule } from './profile/profile.module';
import { MailModule } from './mail/mail.module';
import { DepartmentModule } from './department/department.module';
import dbConfig from './config/db.config';
import dbConfigProduction from './config/db.config.production';
import { APP_PIPE } from '@nestjs/core';
import { RequestModule } from './request/request.module';
import { TourismModule } from './tourism/tourism.module';
import { HealthModule } from './health/health.module';
import { CollectedVehicleModule } from './collected-vehicle/collected-vehicle.module';
import { AppointmentModule } from './appointment/appointment.module';
import { BusModule } from './bus/bus.module';
import { DisasterPointModule } from './disaster-point/disaster-point.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      load: [dbConfig, dbConfigProduction],
    }),
    TypeOrmModule.forRootAsync({
      useFactory:
        process.env.NODE_ENV === 'production' ? dbConfigProduction : dbConfig,
    }),
    AuthModule,
    UserModule,
    ProfileModule,
    MailModule,
    HealthModule,
    DepartmentModule,
    RequestModule,
    TourismModule,
    CollectedVehicleModule,
    AppointmentModule,
    BusModule,
    DisasterPointModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    },
    AppService,
  ],
})
export class AppModule {}
