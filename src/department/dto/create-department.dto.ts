import { IsString } from 'class-validator';

export class CreateDepartmentDto {
  @IsString()
  name: string;

  @IsString()
  phone?: string;

  @IsString()
  email: string;

  @IsString()
  description?: string;
}
