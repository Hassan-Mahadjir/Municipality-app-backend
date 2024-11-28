import { IsArray, IsString } from 'class-validator';

export class CreateSechduleDto {
  @IsString()
  day: string;
  @IsString()
  language: string;

  @IsArray()
  goTimes: string[];
}
