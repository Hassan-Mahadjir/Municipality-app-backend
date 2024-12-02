import { IsString } from 'class-validator';

export class CreateWasteTypeDto {
  @IsString()
  type: string;

  @IsString()
  language: string;

  @IsString()
  departmentName: string;
}
