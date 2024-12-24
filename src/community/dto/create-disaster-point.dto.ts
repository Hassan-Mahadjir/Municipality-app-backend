import { IsNumber, IsString } from 'class-validator';

export class CreateDisasterPointDto {
  @IsString()
  location: string;
  @IsString()
  name: string;

  @IsNumber()
  longitude: number;

  @IsNumber()
  latitude: number;

  @IsNumber()
  capacity: number;

  @IsString()
  language: string;

  @IsString()
  departmentName: string;
}
