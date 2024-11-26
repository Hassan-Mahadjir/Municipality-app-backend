import { IsArray, IsString } from 'class-validator';

export class CreateRequestDto {
  @IsString()
  subject: string;

  @IsString()
  location: string;

  @IsString()
  message: string;

  @IsString()
  departmentName: string;

  @IsString()
  language: string;

  @IsArray()
  imageUrls: string[];
}
