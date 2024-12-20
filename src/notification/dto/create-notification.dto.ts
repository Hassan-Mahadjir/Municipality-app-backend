import { IsNumber, IsString } from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  body: string;

  @IsString()
  language: string;

  reportId?: number;

  requestId?: number;

  animalId?: number;

  appointmentId?: number;
}
