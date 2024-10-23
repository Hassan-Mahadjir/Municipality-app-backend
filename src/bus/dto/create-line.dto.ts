import { IsArray, IsString } from 'class-validator';

export class CreateLineDto {
  @IsString()
  from: string;

  @IsString()
  to: string;

  @IsString()
  departmentName: string;

  @IsArray()
  stationNames: string[];
}
