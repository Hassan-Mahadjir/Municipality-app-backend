import { IsArray, IsNumber, IsString } from 'class-validator';

export class CreateAnimalDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  location: string;

  @IsString()
  contactInfo: string;

  @IsString()
  latitude: string;

  @IsString()
  longitude: string;

  @IsArray()
  imageUrls: string[];

  @IsString()
  language: string;
}
