import {
  IsArray,
  IsBoolean,
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
