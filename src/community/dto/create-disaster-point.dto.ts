import { IsNumber, IsString } from 'class-validator';

export class CreateDisasterPointDto {
  @IsString()
  location: string;

  @IsNumber()
  capacity: number;

  @IsString()
  language: string;

  @IsString()
  departmentName: string;
}
