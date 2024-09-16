import { IsString, IsBoolean, IsOptional, IsBigInt } from 'class-validator';

export class UpdateHistoricalPlaceDto {
  @IsBigInt()
  @IsOptional()
  id?: bigint;

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

  @IsBigInt()
  @IsOptional()
  serviceId?: bigint;
}
