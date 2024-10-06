import { IsString, IsBoolean, IsOptional, IsInt } from 'class-validator';

export class UpdateHistoricalPlaceDto {
  @IsInt()
  @IsOptional()
  id?: number;

  @IsString()
  @IsOptional()
  name?: string;

  @IsBoolean()
  @IsOptional()
  weekends?: boolean;

  @IsBoolean()
  @IsOptional()
  weekdays?: boolean;

  @IsString()
  @IsOptional()
  history?: string;

  @IsString()
  @IsOptional()
  openWeekdays?: string;

  @IsString()
  @IsOptional()
  closeWeekdays?: string;

  @IsString()
  @IsOptional()
  openWeekends?: string;

  @IsString()
  @IsOptional()
  closeWeekends?: string;

  @IsInt()
  @IsOptional()
  serviceId?: number;
}
