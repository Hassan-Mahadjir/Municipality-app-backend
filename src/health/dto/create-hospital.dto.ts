import { IsBoolean, IsNumber, IsString, IsUrl } from 'class-validator';

export class CreateHospitalDto {
  @IsString()
  name: string;
  @IsString()
  location: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsUrl()
  imageUrl: string;
  @IsUrl()
  logo: string;
  @IsString()
  departmetName?: string;
  @IsString()
  language: string;
}
