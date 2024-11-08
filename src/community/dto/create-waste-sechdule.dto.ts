import { IsArray, IsObject, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class DaySchedule {
  @IsString()
  day: string;

  @IsString()
  startTime: string;

  @IsString()
  endTime: string;
}

export class CreateWasteSechduleDto {
  @IsString()
  wasteType: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DaySchedule)
  days: DaySchedule[];
}
