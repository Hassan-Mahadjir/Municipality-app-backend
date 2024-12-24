import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsPhoneNumber,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateRestaurantDto {
  @IsString()
  name: string;

  @IsBoolean()
  open: boolean;

  @IsPhoneNumber()
  phone: string;

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
