import { IsString } from 'class-validator';

export class CreateAppointmentDto {
  @IsString()
  purpose: string;

  @IsString()
  appointmentWith: string;

  @IsString()
  date: string;

  @IsString()
  language: string;

  @IsString()
  startTime: string;
}
