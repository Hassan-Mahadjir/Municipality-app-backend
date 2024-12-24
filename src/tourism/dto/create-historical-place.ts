import { IsArray, IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateHistoricalPlaceDto {
  @IsString()
  name: string;

  @IsBoolean()
  open: boolean;

  @IsString()
  history: string;

  @IsString()
  location: string;
  @IsNumber()
  longitude: number;
    
  @IsNumber()
  latitude: number;


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

  @IsString()
  language: string;
}
