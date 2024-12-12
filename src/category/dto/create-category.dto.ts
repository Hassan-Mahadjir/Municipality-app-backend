import { IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  language: string;

  @IsString()
  name: string;
}
