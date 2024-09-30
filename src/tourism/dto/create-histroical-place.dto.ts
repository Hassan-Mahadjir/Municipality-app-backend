import { IsString, IsBoolean, IsOptional, IsInt } from 'class-validator';

export class CreateHistoricalPlaceDto {
  @IsInt()
  id: number;

  @IsString()
  name: string;

  @IsBoolean()
  @IsOptional()
  weekends?: boolean;

  @IsBoolean()
  @IsOptional()
  weekdays?: boolean;

  @IsString()
  history: string;

  @IsString()
  openWeekdays: string;

  @IsString()
  closeWeekdays: string;

  @IsString()
  openWeekends: string;

  @IsString()
  closeWeekends: string;
}
