import { Module, ValidationPipe } from '@nestjs/common';
import { UserController } from './user.controller';
import { APP_PIPE } from '@nestjs/core';

@Module({
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
  ],
})
export class UserModule {}
