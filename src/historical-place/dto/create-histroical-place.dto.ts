import { IsString, IsBoolean, IsOptional, IsBigInt } from 'class-validator';

export class CreateHistoricalPlaceDto {
  @IsBigInt()
  id: bigint;

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

  @IsBigInt()
  serviceId: bigint;
}
