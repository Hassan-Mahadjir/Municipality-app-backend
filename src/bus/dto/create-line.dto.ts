import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';

export class CreateLineDto {
  @IsString()
  from: string;

  @IsString()
  to: string;

  @IsString()
  departmentName: string;

  @IsArray()
  stationNames: string[];

  @IsArray()
  @ValidateNested({ each: true }) // Validate each object in the array
  @Type(() => WorkingDayDto) // Transform plain objects into instances of WorkingDayDto
  workingDaysTimes: WorkingDayDto[];
}

class WorkingDayDto {
  @IsString()
  day: string;

  @IsNumber()
  id: number;
}
