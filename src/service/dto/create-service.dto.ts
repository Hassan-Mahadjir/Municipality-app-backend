import { IsString } from 'class-validator';

export class CreateServiceDto {
  @IsString()
  name: string;

  @IsString()
  imageUrl: string;

  @IsString()
  departmentName?: string;
}
