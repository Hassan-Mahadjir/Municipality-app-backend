import { IsString, IsUrl } from 'class-validator';

export class CreateDepartmentDto {
  @IsString()
  name: string;

  @IsString()
  phone?: string;

  @IsString()
  email: string;

  @IsUrl()
  imageUrl: string;

  @IsString()
  description?: string;

  @IsString()
  language: string;
}
