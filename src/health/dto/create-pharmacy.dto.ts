import { IsBoolean, IsNumber, IsString, IsUrl } from 'class-validator';

export class CreatePharmacyDto {
  @IsString()
  name: string;
  @IsString()
  location: string;
  
  @IsString()
  phone:string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsUrl()
  imageUrl: string;
  @IsUrl()
  logo: string;
  @IsBoolean()
  openthisWeek: boolean;
  @IsString()
  departmetName: string;
  @IsString()
  language: string;
}
