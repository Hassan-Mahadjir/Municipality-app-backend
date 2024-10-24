import { IsArray, IsString } from 'class-validator';

export class CreateSechduleDto {
  @IsString()
  day: string;

  @IsArray()
  goTimes: string[];
}
