import { IsArray, IsString } from 'class-validator';

export class CreateAnnoucementDto {
  @IsString()
  title: string;

  @IsString()
  header: string;

  @IsString()
  body: string;

  @IsString()
  location: string;

  @IsString()
  language: string;

  @IsArray()
  imageUrls: string[];

  @IsString()
  departmentName: string;
}
