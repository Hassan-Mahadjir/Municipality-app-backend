import { IsString, IsUrl,IsNumber } from 'class-validator';

export class CreateAnimalShelterDto {
  @IsString()
  name: string;

  @IsString()
  location: string;
  
  @IsNumber()
  longitude: number;
  
  @IsNumber()
  latitude: number;

  @IsUrl()
  logo: string;

  @IsString()
  departmentName: string;

  @IsString()
  language: string;
}
