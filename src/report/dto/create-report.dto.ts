import { IsArray, IsString } from 'class-validator';

export class CreateReportDto {
  @IsString()
  subject: string;

  @IsString()
  longitude: string;

  @IsString()
  latitude: string;

  @IsString()
  message: string;

  @IsString()
  departmentName: string;

  @IsString()
  language: string;

  @IsArray()
  imageUrls: string[];
}
