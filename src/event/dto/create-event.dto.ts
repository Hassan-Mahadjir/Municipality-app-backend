import { IsArray, IsString } from 'class-validator';

export class CreateEventDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  location: string;

  @IsString()
  header: string;

  @IsString()
  category: string;

  @IsString()
  startTime: string;

  @IsString()
  date: string;

  @IsString()
  departmentName: string;

  @IsArray()
  imageUrls: string[];
  @IsString()
  language:string;
}
