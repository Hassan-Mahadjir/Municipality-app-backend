import { IsString } from 'class-validator';

export class CreateReportDto {
  @IsString()
  subject: string;

  @IsString()
  location: string;

  @IsString()
  message: string;

  @IsString()
  departmentName: string;
}