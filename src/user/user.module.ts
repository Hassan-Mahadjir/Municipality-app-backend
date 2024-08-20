import { Module, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Profile } from 'src/entities/profile.entity';
import { APP_PIPE } from '@nestjs/core';
import { ProfileService } from 'src/profile/profile.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Profile])],
  controllers: [UserController],
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
    UserService,
    ProfileService,
  ],
})
export class UserModule {}
