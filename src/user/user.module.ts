import { Module, ValidationPipe } from '@nestjs/common';
import { UserController } from './user.controller';
import { APP_PIPE } from '@nestjs/core';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [
    {
      // Apply Validation on certian Module
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
  ],
})
export class UserModule {}
