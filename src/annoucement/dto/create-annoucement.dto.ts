import { IsArray, IsString } from 'class-validator';

export class CreateAnnoucementDto {
  @IsString()
  type: string;

  @IsString()
  title: string;

  @IsString()
  header: string;

  @IsString()
  body: string;

  @IsString()
  location: string;

  @IsArray()
  imageUrls: string[];

  @IsString()
  departmentName: string;
}
