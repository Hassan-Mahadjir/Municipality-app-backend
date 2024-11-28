import { IsArray, IsNumber, IsString } from 'class-validator';
export class CreateSlotDto {
  @IsString()
  date: string;

  @IsNumber()
  numberOfSlots: number;

  @IsArray()
  startingTimes: string[];

  @IsNumber()
  duration: number;

  @IsString()
  language: string;

  @IsString()
  departmentName: string;
}
