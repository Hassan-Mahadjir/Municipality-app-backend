import { IsArray, IsBoolean, IsString } from 'class-validator';

export class CreateHistoricalPlaceDto {
  @IsString()
  name: string;

  @IsBoolean()
  open: boolean;

  @IsString()
  history: string;

  @IsString()
  location: string;

  @IsString()
  openingHrWeekday: string;

  @IsString()
  openingHrWeekend: string;

  @IsString()
  closingHrWeekday: string;

  @IsString()
  closingHrWeekend: string;

  @IsString()
  departmentName: string;

  @IsArray()
  imageUrls: string[];
}
